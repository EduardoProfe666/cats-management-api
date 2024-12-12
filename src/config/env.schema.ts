import * as Joi from 'joi';

export const envSchema = Joi.object({
  APP_PORT: Joi.number().default(4001).required(),
  SECRET_KEY: Joi.string().required(),
  SEED_ADMIN_EMAIL: Joi.string().required(),
  SEED_ADMIN_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  SWAGGER_PASSWORD: Joi.string().required(),
}).unknown();