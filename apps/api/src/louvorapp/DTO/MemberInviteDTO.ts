import { Required, Optional, NotEmpty, Email, ItemType } from 'joi-typescript-validator';

export default class MemberInviteDTO {
  @Required()
  @NotEmpty()
  public name: string;

  @Required()
  @NotEmpty()
  @Email()
  public email: string;

  @Optional()
  @ItemType(String)
  public skills?: string[];

  @Optional()
  @ItemType(String)
  public roles?: string[];
}