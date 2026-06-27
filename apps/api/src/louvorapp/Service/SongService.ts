import { Injectable, NotFoundException } from '@nestjs/common';
import UidManager from '../Util/UidManager';
import { SongRepository } from '../Repository/SongRepository';
import { SongLinkRepository } from '../Repository/SongLinkRepository';
import { ArtistService } from './ArtistService';
import { Song } from '../Entity/Song';
import { SongLink } from '../Entity/SongLink';
import SongCreateDTO, { SongLinkDTO } from '../DTO/SongCreateDTO';
import Church from '../Entity/Church';

@Injectable()
export class SongService {
  constructor(
    private readonly songRepository: SongRepository,
    private readonly songLinkRepository: SongLinkRepository,
    private readonly artistService: ArtistService,
  ) {}

  public async listByChurch(church: Church): Promise<Song[]> {
    return await this.songRepository.findByChurch(church.id);
  }

  public async getByUid(uid: string, church: Church): Promise<Song> {
    return await this.songRepository.findByUidAndChurch(uid, church.id);
  }

  public async create(dto: SongCreateDTO, church: Church): Promise<Song> {
    const artist = await this.artistService.getByUid(dto.artistUid);
    if (!artist) {
      throw new NotFoundException('Artista não encontrado');
    }

    const song = new Song();
    song.uid = UidManager.generate('song');
    song.church = church;
    song.artist = artist;
    song.createdAt = new Date();
    this.applyFields(song, dto);

    await this.songRepository.persist(song);
    await this.replaceLinks(song, dto.links ?? []);

    return await this.songRepository.findByUidAndChurch(song.uid, church.id);
  }

  public async update(
    uid: string,
    church: Church,
    dto: SongCreateDTO,
  ): Promise<Song> {
    const song = await this.songRepository.findByUidAndChurch(uid, church.id);
    if (!song) {
      throw new NotFoundException('Música não encontrada');
    }

    const artist = await this.artistService.getByUid(dto.artistUid);
    if (!artist) {
      throw new NotFoundException('Artista não encontrado');
    }

    song.artist = artist;
    this.applyFields(song, dto);

    await this.songRepository.flush();
    await this.replaceLinks(song, dto.links ?? []);

    return await this.songRepository.findByUidAndChurch(uid, church.id);
  }

  private applyFields(song: Song, dto: SongCreateDTO): void {
    song.title = dto.title;
    song.key = dto.key;
    song.lyrics = dto.lyrics;
    song.notes = dto.notes;
    song.bpm = dto.bpm;
    song.hasMultitrack = dto.hasMultitrack ?? false;
    song.isActive = dto.isActive ?? true;
    song.attributes = dto.attributes ?? null;
  }

  private async replaceLinks(song: Song, links: SongLinkDTO[]): Promise<void> {
    await this.songLinkRepository.deleteBySong(song.id);

    if (!links.length) {
      return;
    }

    const items = links.map((link) => {
      const songLink = new SongLink();
      songLink.uid = UidManager.generate('song_link');
      songLink.url = link.url;
      songLink.type = link.type;
      songLink.song = song;
      songLink.createdAt = new Date();

      return songLink;
    });

    await this.songLinkRepository.persistMany(items);
  }
}