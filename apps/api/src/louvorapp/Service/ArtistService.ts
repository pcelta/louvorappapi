import { Injectable } from '@nestjs/common';
import UidManager from '../Util/UidManager';
import { ArtistRepository } from '../Repository/ArtistRepository';
import { Artist } from '../Entity/Artist';

@Injectable()
export class ArtistService {
  constructor(private readonly artistRepository: ArtistRepository) {}

  public async search(query: string): Promise<Artist[]> {
    return await this.artistRepository.search(query);
  }

  public async getByUid(uid: string): Promise<Artist> {
    return await this.artistRepository.findByUid(uid);
  }

  public async create(name: string): Promise<Artist> {
    const artist = new Artist();
    artist.uid = UidManager.generate('artist');
    artist.name = name;
    artist.createdAt = new Date();

    await this.artistRepository.persist(artist);

    return artist;
  }
}