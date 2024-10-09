import { IsNumber } from 'class-validator';

export class JobIdParamDto {
  @IsNumber()
  jobId: number;
}
