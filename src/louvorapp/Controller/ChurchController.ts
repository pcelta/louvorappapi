import { Controller, Get, Post, Res, HttpStatus, Body, UseGuards } from '@nestjs/common';
import { Validate } from "joi-typescript-validator"
import { Response } from 'express';
import { ChurchService } from '../Service/ChurchService';
import ChurchCreationDTO from '../DTO/ChurchCreationDTO';
import { AuthGuard } from '../Util/AuthGuard';
import Member from '../Entity/Member';
import { JwtToMemberPipe } from '../Util/JwtToMemberPipe';
import { ExtractJwtData } from '../Util/ExtractJwtDecorator';

@Controller('church')
export class ChurchController {
  constructor(private churchService: ChurchService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async create(@Body() body: ChurchCreationDTO, @Res() res: Response, @ExtractJwtData(JwtToMemberPipe) member: Member) {
    const validation = await Validate(ChurchCreationDTO, body);
    if (validation.error) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: validation.error.message});

      return;
    }

    const church = await this.churchService.createFromCreationDto(body as ChurchCreationDTO);

    res.status(HttpStatus.CREATED).json(church.toRaw());
  }
}
