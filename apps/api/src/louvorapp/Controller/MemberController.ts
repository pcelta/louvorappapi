import {
  Controller,
  Get,
  Post,
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
import { MemberService } from '../Service/MemberService';
import MemberInviteDTO from '../DTO/MemberInviteDTO';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async me(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Res() res: Response,
  ) {
    res.status(HttpStatus.OK).json(member.toRaw());
  }

  @Get()
  @UseGuards(AuthGuard)
  async list(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Res() res: Response,
  ) {
    const members = await this.memberService.listByChurch(member.church);

    res.status(HttpStatus.OK).json(members.map((m) => m.toRaw()));
  }

  @Post()
  @UseGuards(AuthGuard)
  async add(
    @ExtractJwtData(JwtToMemberPipe) admin: Member,
    @Body() body: MemberInviteDTO,
    @Res() res: Response,
  ) {
    const validation = Validate(MemberInviteDTO, body);
    if (validation.error) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: validation.error.message });

      return;
    }

    const { member, invitation } = await this.memberService.invite(
      body.name,
      body.email,
      admin.church,
    );

    res.status(HttpStatus.CREATED).json({
      member: member.toRaw(),
      invitation: {
        code: invitation.code,
        path: `/member-invitation/${invitation.code}`,
        expires_at: invitation.expiresAt,
      },
    });
  }
}