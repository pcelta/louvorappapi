import { Required, NotEmpty } from 'joi-typescript-validator';

export default class ArtistCreateDTO {
  @Required()
  @NotEmpty()
  public name: string;
}