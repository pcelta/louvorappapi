import { Injectable, NotFoundException } from '@nestjs/common';
import UidManager from '../Util/UidManager';
import { WorshipRepository } from '../Repository/WorshipRepository';
import { WorshipSongRepository } from '../Repository/WorshipSongRepository';
import { WorshipTeamRosterRepository } from '../Repository/WorshipTeamRosterRepository';
import { ServiceRepository } from '../Repository/ServiceRepository';
import { SongRepository } from '../Repository/SongRepository';
import { MemberRepository } from '../Repository/MemberRepository';
import { Worship } from '../Entity/Worship';
import { WorshipSong } from '../Entity/WorshipSong';
import { WorshipTeamRoster } from '../Entity/WorshipTeamRoster';
import WorshipCreationDTO from '../DTO/WorshipCreationDTO';
import Church from '../Entity/Church';

@Injectable()
export class WorshipService {
  constructor(
    private readonly worshipRepository: WorshipRepository,
    private readonly worshipSongRepository: WorshipSongRepository,
    private readonly worshipTeamRosterRepository: WorshipTeamRosterRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly songRepository: SongRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  public async listByChurch(church: Church): Promise<Worship[]> {
    return await this.worshipRepository.findByChurch(church.id);
  }

  public async getByUid(uid: string, church: Church): Promise<Worship> {
    return await this.worshipRepository.findByUidAndChurch(uid, church.id);
  }

  public async create(
    dto: WorshipCreationDTO,
    church: Church,
  ): Promise<Worship> {
    const service = await this.serviceRepository.findByUidAndChurch(
      dto.serviceUid,
      church.id,
    );
    if (!service) {
      throw new NotFoundException('Culto não encontrado');
    }

    const worship = new Worship();
    worship.uid = UidManager.generate('worship');
    worship.title = dto.title;
    worship.service = service;
    worship.createdAt = new Date();
    worship.updatedAt = new Date();

    await this.worshipRepository.persist(worship);
    await this.setSongs(worship, church, dto.songUids ?? []);
    await this.setRoster(worship, church, dto.memberUids ?? []);

    return await this.worshipRepository.findByUidAndChurch(
      worship.uid,
      church.id,
    );
  }

  public async update(
    uid: string,
    church: Church,
    dto: WorshipCreationDTO,
  ): Promise<Worship> {
    const worship = await this.worshipRepository.findByUidAndChurch(
      uid,
      church.id,
    );
    if (!worship) {
      throw new NotFoundException('Escala não encontrada');
    }

    const service = await this.serviceRepository.findByUidAndChurch(
      dto.serviceUid,
      church.id,
    );
    if (!service) {
      throw new NotFoundException('Culto não encontrado');
    }

    worship.title = dto.title;
    worship.service = service;

    await this.worshipRepository.flush();
    await this.setSongs(worship, church, dto.songUids ?? []);
    await this.setRoster(worship, church, dto.memberUids ?? []);

    return await this.worshipRepository.findByUidAndChurch(uid, church.id);
  }

  private async setSongs(
    worship: Worship,
    church: Church,
    songUids: string[],
  ): Promise<void> {
    await this.worshipSongRepository.deleteByWorship(worship.id);

    if (!songUids.length) {
      return;
    }

    const songs = await this.songRepository.findByUidsAndChurch(
      songUids,
      church.id,
    );
    const byUid = new Map(songs.map((s) => [s.uid, s]));

    const items: WorshipSong[] = [];
    songUids.forEach((uid, index) => {
      const song = byUid.get(uid);
      if (!song) {
        return;
      }

      const worshipSong = new WorshipSong();
      worshipSong.uid = UidManager.generate('worship_song');
      worshipSong.position = index;
      worshipSong.worship = worship;
      worshipSong.song = song;
      worshipSong.createdAt = new Date();
      worshipSong.updatedAt = new Date();
      items.push(worshipSong);
    });

    await this.worshipSongRepository.persistMany(items);
  }

  private async setRoster(
    worship: Worship,
    church: Church,
    memberUids: string[],
  ): Promise<void> {
    await this.worshipTeamRosterRepository.deleteByWorship(worship.id);

    if (!memberUids.length) {
      return;
    }

    const members = await this.memberRepository.findByUidsAndChurch(
      memberUids,
      church.id,
    );

    const items = members.map((member) => {
      const roster = new WorshipTeamRoster();
      roster.uid = UidManager.generate('worship_team_roster');
      roster.worship = worship;
      roster.member = member;
      roster.createdAt = new Date();
      roster.updatedAt = new Date();

      return roster;
    });

    await this.worshipTeamRosterRepository.persistMany(items);
  }
}