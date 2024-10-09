import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService extends ConsoleLogger {
  constructor() {
    super();
  }

  generateLogMessage(req: Request, resStatusCode: number) {
    const { method, url } = req;

    const personaWithRole = '(Unknown Persona)';

    return `${personaWithRole} hit ${method} ${url} with status code ${resStatusCode}`;
  }
}
