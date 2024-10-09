import { CustomLoggerService } from '@common/modules/common/services/logger';
import { Injectable } from '@nestjs/common';
import { JOBS_TO_PROCESS_PER_ITERATION } from '@shared/constants';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class PaginationHelperService {
  constructor(private readonly logger: CustomLoggerService) {}

  async paginateFind<T>(
    model: Repository<T>,
    whereStage: FindOptionsWhere<T>,
    fn: (docs: T[]) => void | Promise<void>,
  ): Promise<void> {
    let page = 1;
    while (true) {
      const docs = await model.find({
        where: whereStage,
        take: JOBS_TO_PROCESS_PER_ITERATION,
        skip: (page - 1) * JOBS_TO_PROCESS_PER_ITERATION,
      });

      if (!docs.length) {
        break;
      }

      await fn(docs);

      page++;
    }
  }
}
