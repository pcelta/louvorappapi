import {
  Controller,
  Post,
  Put,
  Res,
  HttpStatus,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Validate } from 'joi-typescript-validator';
import { Response } from 'express';
import { ChurchService } from '../Service/ChurchService';
import ChurchCreationDTO from '../DTO/ChurchCreationDTO';
import { AuthGuard } from '../Util/AuthGuard';
import { ExtractJwtData } from '../Util/ExtractJwtDecorator';
import { JwtToMemberPipe } from '../Util/JwtToMemberPipe';
import { logoStorage } from '../Util/LogoStorage';
import Member from '../Entity/Member';

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

  @Put('/')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('logo', { storage: logoStorage }))
  async update(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Body() body: { name?: string },
    @UploadedFile() logo: Express.Multer.File,
    @Res() res: Response,
  ) {
    const logoPath = logo ? `/uploads/logos/${logo.filename}` : undefined;

    const church = await this.churchService.update(
      member.church,
      body.name,
      logoPath,
    );

    res.status(HttpStatus.OK).json(church.toRaw());
  }
}