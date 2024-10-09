import { CustomLoggerService } from '@common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AsyncWrapperService {
  constructor(private readonly logger: CustomLoggerService) {}

  async asyncWrapper(fn: () => Promise<any>) {
    try {
      return await fn();
    } catch (e) {
      this.logger.error(e?.message, { error: e });

      return e;
    }
  }
}
