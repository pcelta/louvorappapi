import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { SkillService } from '../Service/SkillService';

@Controller('skill')
export class SkillController {
  constructor(private skillService: SkillService) {}

  @Get()
  async list(@Res() res: Response) {
    const skills = await this.skillService.listAll();

    res.status(HttpStatus.OK).json(skills.map((s) => s.toRaw()));
  }
}