import { Required, NotEmpty, Email } from 'joi-typescript-validator';

export default class MemberInviteDTO {
  @Required()
  @NotEmpty()
  public name: string;

  @Required()
  @NotEmpty()
  @Email()
  public email: string;
}