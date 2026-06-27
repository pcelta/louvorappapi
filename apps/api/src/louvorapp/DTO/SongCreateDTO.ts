import {
  Required,
  Optional,
  NotEmpty,
  ValidOptions,
  ItemType,
} from 'joi-typescript-validator';
import { Song } from '../Entity/Song';

export const LINK_TYPES = [
  'youtube',
  'spotify',
  'cifraclub',
  'cifras',
  'letras',
  'other',
];

export class SongLinkDTO {
  @Required()
  @NotEmpty()
  public url: string;

  @Required()
  @ValidOptions(...LINK_TYPES)
  public type: string;
}

export class SongAttributesDTO {
  @Optional()
  @ItemType(String)
  public occasions?: string[];
}

export default class SongCreateDTO {
  @Required()
  @NotEmpty()
  public title: string;

  @Required()
  @NotEmpty()
  public artistUid: string;

  @Optional()
  @ValidOptions(...Song.KEYS)
  public key?: string;

  @Optional()
  public lyrics?: string;

  @Optional()
  public notes?: string;

  @Optional()
  public bpm?: number;

  @Optional()
  public hasMultitrack?: boolean;

  @Optional()
  public isActive?: boolean;

  @Optional()
  public attributes?: SongAttributesDTO;

  @Optional()
  @ItemType(SongLinkDTO)
  public links?: SongLinkDTO[];
}