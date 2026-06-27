import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Validate } from 'joi-typescript-validator';
import { Response } from 'express';
import { AuthGuard } from '../Util/AuthGuard';
import { ExtractJwtData } from '../Util/ExtractJwtDecorator';
import { JwtToMemberPipe } from '../Util/JwtToMemberPipe';
import Member from '../Entity/Member';
import { SongService } from '../Service/SongService';
import SongCreateDTO from '../DTO/SongCreateDTO';

@Controller('song')
export class SongController {
  constructor(private songService: SongService) {}

  @Get()
  @UseGuards(AuthGuard)
  async list(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Res() res: Response,
  ) {
    const songs = await this.songService.listByChurch(member.church);

    res.status(HttpStatus.OK).json(songs.map((s) => s.toRaw()));
  }

  @Get(':uid')
  @UseGuards(AuthGuard)
  async get(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Param('uid') uid: string,
    @Res() res: Response,
  ) {
    const song = await this.songService.getByUid(uid, member.church);
    if (!song) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Música não encontrada' });

      return;
    }

    res.status(HttpStatus.OK).json(song.toRaw());
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Body() body: SongCreateDTO,
    @Res() res: Response,
  ) {
    const validation = Validate(SongCreateDTO, body);
    if (validation.error) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: validation.error.message });

      return;
    }

    const song = await this.songService.create(body, member.church);

    res.status(HttpStatus.CREATED).json(song.toRaw());
  }

  @Put(':uid')
  @UseGuards(AuthGuard)
  async update(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Param('uid') uid: string,
    @Body() body: SongCreateDTO,
    @Res() res: Response,
  ) {
    const validation = Validate(SongCreateDTO, body);
    if (validation.error) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: validation.error.message });

      return;
    }

    const song = await this.songService.update(uid, member.church, body);

    res.status(HttpStatus.OK).json(song.toRaw());
  }
}