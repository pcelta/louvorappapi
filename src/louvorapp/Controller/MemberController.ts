import { Controller, Get, Post, Res, Param, HttpStatus, Body } from '@nestjs/common';
import { Validate } from "joi-typescript-validator"
import { Response } from 'express';
import { MemberService } from '../Service/MemberService';
import MemberCreationDTO from '../DTO/MemberCreationDTO';
import AuthorizationService from '../Service/AuthService';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService, private readonly authService: AuthorizationService) {}

  @Get(':emailOrUid')
  async get(@Param() params: any, @Res() res: Response) {
    const member = await this.memberService.getMemberByEmail(params.emailOrUid);

    if (member !== null) {
      res.status(HttpStatus.OK).json( member.toRaw());

      return;
    }

    res.status(HttpStatus.NOT_FOUND).json({ message: 'Member Not Found!'});
 }

 @Post()
 async create(@Body() body: MemberCreationDTO, @Res() res: Response) {
  const validation = await Validate(MemberCreationDTO, body);
  if (validation.error) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: validation.error.message});

    return;
  }

  const existingMember = await this.memberService.getMemberByEmail(body.email);

  if (existingMember !== null) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: 'Email Address already in use!'});

    return;
  }

  const member = await this.memberService.createFromCreationDto(body as MemberCreationDTO);

  res.status(HttpStatus.CREATED).json(member.toRaw());
 }
}
