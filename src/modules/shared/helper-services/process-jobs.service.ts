import {
  CustomLoggerService,
  Job,
  JobRecurrenceModeEnum,
  JobStatusEnum,
  JobTypeEnum,
  ModelNames,
  NO_OF_DAYS_IN_A_MONTH,
  ONE_DAY_IN_MILLISECONDS,
  ONE_MINUTE_IN_MILLISECONDS,
} from '@common';
import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { FindOptionsWhere, In, LessThanOrEqual, Repository } from 'typeorm';
import { AsyncWrapperService } from './async-wrapper.service';
import { PaginationHelperService } from './pagination-helper.service';

@Injectable()
export class ProcessJobsService {
  private readonly redis: Redis;

  constructor(
    @Inject(ModelNames.JOB) private readonly jobModel: Repository<Job>,
    private readonly paginationHelperService: PaginationHelperService,
    private readonly asyncWrapperService: AsyncWrapperService,
    private readonly redisService: RedisService,
    private readonly logger: CustomLoggerService,
  ) {
    this.redis = this.redisService.getClient();
  }

  async onModuleInit() {
    //initial
    this.asyncWrapperService.asyncWrapper(async () => {
      await this.handleOnTimeJobs();
    });
    //repeating
    setInterval(() => {
      this.asyncWrapperService.asyncWrapper(async () => {
        await this.handleOnTimeJobs();
      });
    }, ONE_MINUTE_IN_MILLISECONDS);
  }

  private async handleOnTimeJobs() {
    const whereStage: FindOptionsWhere<Job> = {
      status: In([JobStatusEnum.PENDING, JobStatusEnum.IN_PROGRESS]),
      nextRunTimestamp: LessThanOrEqual(new Date().getTime()),
    };

    await this.paginationHelperService.paginateFind<Job>(this.jobModel, whereStage, async (docs) => {
      for (const doc of docs) {
        const redisKey = this.getRedisJobKey(doc.id);

        const lockDuration = ONE_MINUTE_IN_MILLISECONDS * 5;

        const lock = await this.redis.setnx(redisKey, (Date.now() + lockDuration).toString());

        if (lock === 1) {
          await this.processJob(doc);
          await this.redis.del(redisKey);
        } else {
          const oldKey = await this.redis.get(redisKey);

          if (oldKey) {
            const expiryTimestamp = Number(oldKey);

            if (expiryTimestamp < Date.now()) {
              //clear expired keys
              await this.redis.del(redisKey);
            }
          }
        }
      }
    });
  }

  private async processJob(job: Job) {
    const { recurrenceMode, status, lastRunTimestamp, startTimestamp } = job;

    const finalJob = job;

    if (status === JobStatusEnum.PENDING) {
      finalJob.status = JobStatusEnum.IN_PROGRESS;
    }

    const temp = finalJob.nextRunTimestamp;

    if (recurrenceMode === JobRecurrenceModeEnum.NONE) {
      finalJob.status = JobStatusEnum.COMPLETED;
    }
    if (recurrenceMode === JobRecurrenceModeEnum.DAILY) {
      finalJob.nextRunTimestamp = lastRunTimestamp ? lastRunTimestamp : startTimestamp + ONE_DAY_IN_MILLISECONDS;
    }
    if (recurrenceMode === JobRecurrenceModeEnum.WEEKLY) {
      finalJob.nextRunTimestamp = lastRunTimestamp ? lastRunTimestamp : startTimestamp + ONE_DAY_IN_MILLISECONDS * 7;
    }
    if (recurrenceMode === JobRecurrenceModeEnum.MONTHLY) {
      finalJob.nextRunTimestamp = lastRunTimestamp
        ? lastRunTimestamp
        : startTimestamp + ONE_DAY_IN_MILLISECONDS * NO_OF_DAYS_IN_A_MONTH;
    }

    finalJob.lastRunTimestamp = temp;

    await this.handleJobAction(job);

    await this.jobModel.save(finalJob);
  }

  private handleJobAction(job: Job) {
    switch (job.type) {
      case JobTypeEnum.SEND_MAIL:
        return this.sendMail(job);
      case JobTypeEnum.DO_CALCULATION:
        return this.doCalculation(job);
      default:
        this.logger.error('unhandled job type');
    }
  }

  private async sendMail(job: Job) {
    //dummy function
  }

  private async doCalculation(job: Job) {
    //dummy function
  }

  private getRedisJobKey(jobId: number) {
    return `job:${jobId.toString()}`;
  }
}
