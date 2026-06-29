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
import { WorshipService } from '../Service/WorshipService';
import WorshipCreationDTO from '../DTO/WorshipCreationDTO';

@Controller('worship')
export class WorshipController {
  constructor(private worshipService: WorshipService) {}

  @Get()
  @UseGuards(AuthGuard)
  async list(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Res() res: Response,
  ) {
    const worships = await this.worshipService.listByChurch(member.church);

    res.status(HttpStatus.OK).json(worships.map((w) => w.toRaw()));
  }

  @Get(':uid')
  @UseGuards(AuthGuard)
  async get(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Param('uid') uid: string,
    @Res() res: Response,
  ) {
    const worship = await this.worshipService.getByUid(uid, member.church);
    if (!worship) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Escala não encontrada' });

      return;
    }

    res.status(HttpStatus.OK).json(worship.toRaw());
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Body() body: WorshipCreationDTO,
    @Res() res: Response,
  ) {
    const validation = Validate(WorshipCreationDTO, body);
    if (validation.error) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: validation.error.message });

      return;
    }

    const worship = await this.worshipService.create(body, member.church);

    res.status(HttpStatus.CREATED).json(worship.toRaw());
  }

  @Put(':uid')
  @UseGuards(AuthGuard)
  async update(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Param('uid') uid: string,
    @Body() body: WorshipCreationDTO,
    @Res() res: Response,
  ) {
    const validation = Validate(WorshipCreationDTO, body);
    if (validation.error) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: validation.error.message });

      return;
    }

    const worship = await this.worshipService.update(uid, member.church, body);

    res.status(HttpStatus.OK).json(worship.toRaw());
  }
}