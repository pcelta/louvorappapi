import { Validate, Required, NotEmpty, MaxLength, MinLength, DateString, Email } from "joi-typescript-validator"

export default class ChurchCreationDTO {
  @Required()
  @NotEmpty()
  public name: string;
}
