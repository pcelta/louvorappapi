import { Required, NotEmpty, ItemType } from 'joi-typescript-validator';
import UserCreationDTO from './UserCreationDTO';

export class ChurchMemberDTO {
  @Required()
  public user: UserCreationDTO;
}

export default class ChurchCreationDTO {
  @Required()
  @NotEmpty()
  public name: string;

  @Required()
  @NotEmpty()
  @ItemType(ChurchMemberDTO)
  public members: ChurchMemberDTO[];
}