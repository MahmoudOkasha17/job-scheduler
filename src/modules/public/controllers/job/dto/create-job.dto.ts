import { Job } from '@common';
import { PickType } from '@nestjs/swagger';

export class CreateJobDto extends PickType(Job, ['name', 'type', 'recurrenceMode', 'startTimestamp'] as const) {}
