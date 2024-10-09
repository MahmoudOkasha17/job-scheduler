import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class DbHealthService extends HealthIndicator {
  constructor(private db: TypeOrmHealthIndicator) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const result = await this.db.pingCheck('database', { timeout: 300 });

    if (result['database'].status !== 'up') {
      throw new HealthCheckError('Database Health failed', result);
    }

    return result;
  }
}
