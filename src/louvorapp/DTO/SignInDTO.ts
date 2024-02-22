import { Validate, Required, NotEmpty, MaxLength, MinLength, DateString, Email } from "joi-typescript-validator"
import User from "../Entity/User";

export default class SignInDTO {
  @Required()
  @NotEmpty()
  @Email()
  public email: string;

  @Required()
  @MaxLength(30)
  @MinLength(8)
  public password: string;
}
