import { Controller, Get, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../Util/AuthGuard';
import { ExtractJwtData } from '../Util/ExtractJwtDecorator';
import { JwtToMemberPipe } from '../Util/JwtToMemberPipe';
import Member from '../Entity/Member';

@Controller('member')
export class MemberController {
  @Get('me')
  @UseGuards(AuthGuard)
  async me(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Res() res: Response,
  ) {
    res.status(HttpStatus.OK).json(member.toRaw());
  }
}