import { CommonModule } from '@common';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PublicModule } from '@public/public.module';

@Module({
  imports: [
    PublicModule,
    RouterModule.register([{ path: 'public', module: PublicModule }]),
    CommonModule.registerAsync({
      appConfig: {
        appShortName: 'jop-schedular',
      },
      useFactory: {
        default: () => ({
          memoryConfig: {
            minHeapSizeInBytes: 512 * 1024 * 1024,
            maxHeapSizeInBytes: 8192 * 1024 * 1024,
          },
        }),
      },
      inject: {
        default: [],
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
