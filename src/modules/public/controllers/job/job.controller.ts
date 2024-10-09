import { CustomResponse } from '@common';
import { Body, Controller, Get, Param, Post, Query, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobIdParamDto } from '@public/shared/dto/job-id-param.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { GetJobsQueryDto } from './dto/get-jobs.dto';
import { JobService } from './job.service';

@Controller({ path: 'job', version: VERSION_NEUTRAL })
@ApiTags('public/job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async getJobs(@Query() query: GetJobsQueryDto) {
    const results = await this.jobService.getJobs(query);
    return new CustomResponse().success({
      payload: results,
    });
  }

  @Post()
  async createJob(@Body() body: CreateJobDto) {
    const result = await this.jobService.createJob(body);

    return new CustomResponse().success({
      payload: { data: result },
    });
  }

  @Get(':jobId')
  async getJobById(@Param() param: JobIdParamDto) {
    const result = await this.jobService.getJobById(param);
    return new CustomResponse().success({
      payload: {
        data: result,
      },
    });
  }
}
