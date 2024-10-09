export enum JobStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum JobRecurrenceModeEnum {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

// mock task types for the sake of this task ( other fields should also be added schema to do such task but not added right now)
export enum JobTypeEnum {
  SEND_MAIL = 'SEND_MAIL',
  DO_CALCULATION = 'DO_CALCULATION',
}
