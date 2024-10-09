import { AppConfigOptions } from '@common/interfaces/app-config-options';
import * as Joi from 'joi';

export const configSchema = () => {
  return Joi.object({
    NODE_ENV: Joi.string().required(),

    REDIS_HOST: Joi.string().optional().default('localhost'),
    REDIS_PORT: Joi.number().optional().default(6379),

    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_HOST: Joi.string().required(),
  });
};
