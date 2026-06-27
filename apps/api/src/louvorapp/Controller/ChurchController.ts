import { Controller, Post, Res, HttpStatus, Body } from '@nestjs/common';
import { Validate } from 'joi-typescript-validator';
import { Response } from 'express';
import { ChurchService } from '../Service/ChurchService';
import ChurchCreationDTO from '../DTO/ChurchCreationDTO';

@Controller('church')
export class ChurchController {
  constructor(private churchService: ChurchService) {}

  @Post('/')
  async create(@Body() body: ChurchCreationDTO, @Res() res: Response) {
    const validation = Validate(ChurchCreationDTO, body);
    if (validation.error) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: validation.error.message });

      return;
    }

    const church = await this.churchService.createFromCreationDto(
      body as ChurchCreationDTO,
    );

    res.status(HttpStatus.CREATED).json(church.toRaw());
  }
}