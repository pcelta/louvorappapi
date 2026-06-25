import {
  Required,
  NotEmpty,
  MaxLength,
  MinLength,
  DateString,
  Email,
  CustomSchema,
} from 'joi-typescript-validator';
import Joi from 'joi';

export default class UserCreationDTO {
  @Required()
  @NotEmpty()
  public name: string;

  @Required()
  @NotEmpty()
  @Email()
  public email: string;

  @Required()
  @NotEmpty()
  @DateString('YYYY-MM-DD')
  public dob: string;

  @Required()
  @MaxLength(30)
  @MinLength(8)
  public password: string;

  @Required()
  @NotEmpty()
  @CustomSchema((schema) =>
    (schema as Joi.StringSchema).pattern(/^\+[1-9]\d{1,14}$/).messages({
      'string.pattern.base': 'phone must be in E.164 format, e.g. +14155552671',
    }),
  )
  public phone: string;
}
