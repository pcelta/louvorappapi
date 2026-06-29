import {
  Required,
  Optional,
  NotEmpty,
  ItemType,
} from 'joi-typescript-validator';

export default class WorshipCreationDTO {
  @Required()
  @NotEmpty()
  public title: string;

  @Required()
  @NotEmpty()
  public serviceUid: string;

  @Optional()
  @ItemType(String)
  public songUids?: string[];

  @Optional()
  @ItemType(String)
  public memberUids?: string[];
}