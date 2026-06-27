import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Validate } from 'joi-typescript-validator';
import { Response } from 'express';
import { AuthGuard } from '../Util/AuthGuard';
import { ArtistService } from '../Service/ArtistService';
import ArtistCreateDTO from '../DTO/ArtistCreateDTO';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  @UseGuards(AuthGuard)
  async search(@Query('search') search: string, @Res() res: Response) {
    const artists = await this.artistService.search(search ?? '');

    res.status(HttpStatus.OK).json(artists.map((a) => a.toRaw()));
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: ArtistCreateDTO, @Res() res: Response) {
    const validation = Validate(ArtistCreateDTO, body);
    if (validation.error) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: validation.error.message });

      return;
    }

    const artist = await this.artistService.create(body.name);

    res.status(HttpStatus.CREATED).json(artist.toRaw());
  }
}