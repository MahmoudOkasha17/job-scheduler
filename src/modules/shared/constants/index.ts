import { VersionOptions } from '@nestjs/common/interfaces';

export const globalControllerVersioning: VersionOptions = {
  version: ['1'],
};

export const JOBS_TO_PROCESS_PER_ITERATION = 100;
