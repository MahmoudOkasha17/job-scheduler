import { Column, CreateDateColumn, DataSource, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { JobRecurrenceModeEnum, JobStatusEnum, JobTypeEnum } from './job.enum';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsDateAfterNow } from '@common/decorators/class-validator/common';

@Entity({})
@Index(['status', 'nextRunTimestamp'])
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 500,
  })
  @IsString()
  name: string;

  @Column({
    enum: JobStatusEnum,
    default: JobStatusEnum.PENDING,
  })
  @IsString()
  @IsEnum(JobStatusEnum)
  status: JobStatusEnum;

  @Column({
    enum: JobTypeEnum,
  })
  @IsString()
  @IsEnum(JobTypeEnum)
  type: JobTypeEnum;

  @Column({
    enum: JobRecurrenceModeEnum,
  })
  @IsString()
  @IsEnum(JobRecurrenceModeEnum)
  recurrenceMode: JobRecurrenceModeEnum;

  @Column({ type: 'bigint' })
  @IsNumber()
  @IsDateAfterNow()
  startTimestamp: number;

  @Column({ type: 'bigint', nullable: true })
  @IsOptional()
  @IsNumber()
  lastRunTimestamp?: number | null;

  @Column({ type: 'bigint', nullable: true })
  @IsOptional()
  @IsNumber()
  nextRunTimestamp?: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export function jobSchemaFactory(dataSource: DataSource) {
  const repository = dataSource.getRepository(Job);

  return repository;
}
