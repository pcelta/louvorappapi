import { Required, NotEmpty, MaxLength, MinLength, DateString, Email } from "joi-typescript-validator"

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
  @DateString("YYYY-MM-DD")
  public dob: string;

  @Required()
  @MaxLength(30)
  @MinLength(8)
  public password: string;
}
