import {
  Required,
  NotEmpty,
  ItemType,
  Optional,
} from 'joi-typescript-validator';

export default class ServiceCreationDTO {
  @Optional()
  public title?: string;

  @Optional()
  public subtitle?: string;

  @Optional()
  public notes?: string;

  @Optional()
  public isSupper?: boolean;

  @Required()
  @NotEmpty()
  public scheduledAt: string;

  @Optional()
  @ItemType(String)
  public pastorUids?: string[];
}