import { Job, ModelNames, ResponsePayload } from '@common';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { errorManager } from '@public/shared/config/errors.config';
import { JobIdParamDto } from '@public/shared/dto/job-id-param.dto';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { GetJobsQueryDto } from './dto/get-jobs.dto';

@Injectable()
export class JobService {
  constructor(@Inject(ModelNames.JOB) private readonly jobModel: Repository<Job>) {}

  async getJobs(query: GetJobsQueryDto): Promise<ResponsePayload<Job>> {
    const { page, limit, search, recurrenceMode, type } = query;

    const whereStage: FindOptionsWhere<Job> = {
      ...(type && { type }),
      ...(recurrenceMode && { recurrenceMode }),
      ...(search && { name: Like(`%${search}%`) }),
    };

    const [total, docs] = await Promise.all([
      this.jobModel.countBy(whereStage),
      this.jobModel.find({
        where: whereStage,
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true,
          name: true,
          type: true,
          recurrenceMode: true,
          startTimestamp: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return { data: docs, total, limit, page, pages: Math.ceil(total / limit) };
  }

  async createJob(body: CreateJobDto) {
    const { startTimestamp } = body;

    const savedJob = await this.jobModel.save({
      ...body,
      nextRunTimestamp: startTimestamp,
    });

    return this.getJobById({ jobId: savedJob.id });
  }

  async getJobById({ jobId }: JobIdParamDto) {
    const job = await this.jobModel.findOneBy({
      id: jobId,
    });

    if (!job) {
      throw new NotFoundException(errorManager.JOB_NOT_FOUND);
    }

    return job;
  }
}
