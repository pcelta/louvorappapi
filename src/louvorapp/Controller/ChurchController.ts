import { Controller, Get, Post, Res, HttpStatus, Body, UseGuards } from '@nestjs/common';
import { Validate } from "joi-typescript-validator"
import { Response } from 'express';
import { ChurchService } from '../Service/ChurchService';
import ChurchCreationDTO from '../DTO/ChurchCreationDTO';
import { AuthGuard } from '../Util/AuthGuard';
import { ExtractJwtData } from '../Util/ExtractJwtDecorator';
import { JwtToUserPipe } from '../Util/JwtToUserPiper';
import User from '../Entity/User';
import { MemberService } from '../Service/MemberService';

@Controller('church')
export class ChurchController {
  constructor(private churchService: ChurchService, private memberService: MemberService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async create(@Body() body: ChurchCreationDTO, @Res() res: Response, @ExtractJwtData(JwtToUserPipe) user: User) {
    const validation = Validate(ChurchCreationDTO, body);
    if (validation.error) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: validation.error.message});

      return;
    }

    const church = await this.churchService.createFromCreationDto(body as ChurchCreationDTO, user);

    res.status(HttpStatus.CREATED).json(church.toRaw());
  }
}
