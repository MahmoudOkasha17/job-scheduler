import { configSchema } from '@common/schemas/joi';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule, RedisModuleOptions } from '@songkeys/nestjs-redis';
import { EnvConfigModule } from '../env-config/env-config.module';
import { AppConfig } from '../env-config/services/app-config';
import { HealthController } from './controllers';
import { ExceptionFilter } from './filters';
import { ApiVersionGuard } from './guards';
import { LoggingInterceptor } from './interceptors';
import { CommonModuleAsyncOptions } from './interfaces';
import { createAsyncProviders } from './providers';
import { EventListenerErrorHandlerService } from './services/event-listener-handlers';
import { DbHealthService } from './services/health-checks';
import { CustomLoggerService } from './services/logger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentEnum } from '@common/enums';

@Module({})
export class CommonModule {
  static registerAsync(options: CommonModuleAsyncOptions): DynamicModule {
    if (!options.useFactory) throw new Error('Missing Configurations for CommonModule: useFactory is required');

    const defaultAppConfigOptions = {};

    const appConfigOptions = {
      ...defaultAppConfigOptions,
      ...options.appConfig,
    };

    const providers = [
      ...createAsyncProviders(options),
      DbHealthService,
      EventListenerErrorHandlerService,
      CustomLoggerService,
      LoggingInterceptor,
    ];

    const imports = [
      ...(options.imports ?? []),
      EnvConfigModule.register(appConfigOptions),
      TerminusModule,
      ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema() }),
      EventEmitterModule.forRoot(),
      RedisModule.forRootAsync({
        imports: [],
        inject: [AppConfig],
        useFactory: async (appConfig: AppConfig): Promise<RedisModuleOptions> => {
          return {
            config: {
              host: appConfig.REDIS_HOST ?? 'redis',
              port: appConfig.REDIS_PORT,
            },
          };
        },
      }),
      TypeOrmModule.forRootAsync({
        inject: [AppConfig],
        useFactory: async (appConfig: AppConfig) => {
          return {
            type: 'postgres',
            username: appConfig.DB_USERNAME,
            password: appConfig.DB_PASSWORD,
            database: appConfig.DB_NAME,
            port: appConfig.DB_PORT,
            host: appConfig.DB_HOST,
            entities: [__dirname + '/../../**/*.entity.{js,ts}'],
            synchronize: appConfig.NODE_ENV === EnvironmentEnum.PROD ? false : true,
          };
        },
      }),
    ];

    return {
      module: CommonModule,
      imports,
      providers: [
        ...providers,
        {
          provide: APP_FILTER,
          useClass: ExceptionFilter,
        },
        {
          provide: APP_GUARD,
          useClass: ApiVersionGuard,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
      ],
      exports: [...imports, ...providers],
      global: true,
      controllers: [HealthController],
    };
  }
}
