import { Transform, TransformFnParams } from 'class-transformer';

export function TransformDateToEndOfDay() {
  return Transform((fnParams: TransformFnParams) => {
    if (fnParams.value instanceof Date) {
      fnParams.value.setHours(23, 59, 59, 999);
      return fnParams.value;
    }
    return fnParams.value;
  });
}
