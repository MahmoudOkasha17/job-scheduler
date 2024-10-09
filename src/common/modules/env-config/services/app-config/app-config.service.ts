import { EnvironmentEnum } from '@common/enums';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  constructor(private readonly configService: ConfigService) {}

  NODE_ENV: string = this.configService.get('NODE_ENV');

  REDIS_HOST: string = this.configService.get('REDIS_HOST');
  REDIS_PORT: number = this.configService.get('REDIS_PORT');

  DB_USERNAME = this.configService.get('DB_USERNAME');
  DB_PASSWORD = this.configService.get('DB_PASSWORD');
  DB_NAME = this.configService.get('DB_NAME');
  DB_PORT = this.configService.get('DB_PORT');
  DB_HOST = this.configService.get('DB_HOST');

  get UPTIME() {
    return process.uptime();
  }

  static get NODE_ENV() {
    return process.env.NODE_ENV as EnvironmentEnum;
  }
}
