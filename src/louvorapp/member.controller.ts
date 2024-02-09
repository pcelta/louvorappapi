import { Controller, Get, Res, Param, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MemberService } from './Service/MemberService';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get(':emailOrUid')
  async getHello(@Param() params: any, @Res() res: Response) {
    const member = await this.memberService.getMemberByEmail(params.emailOrUid);

    if (member !== null) {
      res.status(HttpStatus.OK).json(member);

      return;
    }

    res.status(HttpStatus.NOT_FOUND).json({ message: 'Member Not Found!'});
 }
}
