import { CustomError, ErrorType } from '@common';

export const errorManager = {
  JOB_NOT_FOUND: new CustomError({
    localizedMessage: {
      en: 'Job not found',
      ar: 'الوظيفة غير موجودة',
    },
    errorType: ErrorType.NOT_FOUND,
    event: 'JOB_NOT_FOUND',
  }),
};
