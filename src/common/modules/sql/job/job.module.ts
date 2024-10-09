import { ModelNames } from '@common/constants';
import { jobSchemaFactory } from '@common/schemas/sql/job';
import { FactoryProvider, Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/typeorm';

const MongooseDynamicModule: FactoryProvider = {
  provide: ModelNames.JOB,
  inject: [getConnectionToken()],
  useFactory: jobSchemaFactory,
};

const providers = [MongooseDynamicModule];

@Module({
  imports: [],
  providers: providers,
  exports: providers,
})
export class JobSqlModule {}
