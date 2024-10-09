import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { JobController } from './controllers/job/job.controller';
import { JobService } from './controllers/job/job.service';

@Module({
  imports: [SharedModule],
  controllers: [JobController],
  providers: [JobService],
})
export class PublicModule {}
