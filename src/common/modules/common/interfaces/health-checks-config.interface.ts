import { HealthIndicatorResult } from '@nestjs/terminus';

type HealthCheckFunction = () => HealthIndicatorResult | Promise<HealthIndicatorResult>;

export interface HealthChecksConfig {}
