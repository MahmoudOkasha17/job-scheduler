import { BaseSearchPaginationQuery, JobRecurrenceModeEnum, JobTypeEnum } from '@common';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetJobsQueryDto extends BaseSearchPaginationQuery {
  @IsOptional()
  @IsString()
  @IsEnum(JobRecurrenceModeEnum)
  recurrenceMode?: JobRecurrenceModeEnum;

  @IsOptional()
  @IsString()
  @IsEnum(JobTypeEnum)
  type?: JobTypeEnum;
}
