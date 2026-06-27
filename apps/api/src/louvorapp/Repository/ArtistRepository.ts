import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { Artist } from '../Entity/Artist';

@Injectable()
export class ArtistRepository extends AbstractRepository {
  public async persist(artist: Artist): Promise<void> {
    delete artist['id'];
    await this.em.persist(artist).flush();
  }

  public async search(query: string): Promise<Artist[]> {
    const where = query
      ? { name: { $ilike: `%${query}%` } }
      : {};

    return await this.em.find(Artist, where, {
      orderBy: { name: 'asc' },
      limit: 20,
    });
  }

  public async findByUid(uid: string): Promise<Artist> {
    return await this.em.findOne(Artist, { uid });
  }
}