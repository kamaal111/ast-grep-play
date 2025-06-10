import Joi from 'joi';
import z from 'zod';

import { MAX_YEAR } from './other-source';

const MINIMUM_YEAR = 1970;

enum Job {
  Developer = 'developer',
  DevOps = 'devops',
  Designer = 'designer',
}

export const employee = Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(30).required(),
  birthyear: Joi.number().integer().min(MINIMUM_YEAR).max(MAX_YEAR),
  job: Joi.string().valid(...Object.values(Job)),
  nickname: Joi.string()
    .required()
    .min(3)
    .max(20)
    .description('Nickname')
    .regex(/^[a-z]+$/, { name: 'alpha', invert: true }),
});

export const zEmployee = z.object({
  name: z
    .string()
    .regex(/^[a-z0-9]+$/)
    .min(3)
    .max(30),
  birthyear: z.number().int().min(MINIMUM_YEAR).max(MAX_YEAR).optional(),
});
