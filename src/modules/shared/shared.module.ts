import { Module } from '@nestjs/common';
import { AsyncWrapperService } from './helper-services/async-wrapper.service';
import { ProcessJobsService } from './helper-services/process-jobs.service';
import { JobSqlModule } from '@common';
import { PaginationHelperService } from './helper-services/pagination-helper.service';

const imports = [JobSqlModule];
const providers = [AsyncWrapperService, PaginationHelperService, ProcessJobsService];

@Module({
  imports,
  providers,
  exports: [...imports, ...providers],
})
export class SharedModule {}
