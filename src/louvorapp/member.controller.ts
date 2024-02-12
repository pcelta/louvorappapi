import { Controller, Get, Post, Res, Param, HttpStatus, Body } from '@nestjs/common';
import { Validate } from "joi-typescript-validator"
import { Response } from 'express';
import { MemberService } from './Service/MemberService';
import MemberCreationDTO from './DTO/MemberCreationDTO';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get(':emailOrUid')
  async getHello(@Param() params: any, @Res() res: Response) {
    const member = await this.memberService.getMemberByEmail(params.emailOrUid);

    if (member !== null) {
      delete member['fk_user'];
      delete member['id'];
      delete member['user']['id'];
      delete member['user']['password'];

      res.status(HttpStatus.OK).json(member);

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

  const member = await this.memberService.createFromCreationDto(body as MemberCreationDTO);

  delete member['id'];
  delete member['fk_user'];

  res.status(HttpStatus.CREATED).json({...member});
 }
}
