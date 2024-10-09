import { Transform, TransformFnParams } from 'class-transformer';

export function TransformDateToStartOfDay() {
  return Transform((fnParams: TransformFnParams) => {
    if (fnParams.value instanceof Date) {
      fnParams.value.setHours(0, 0, 0, 0);
      return fnParams.value;
    }
    return fnParams.value;
  });
}
