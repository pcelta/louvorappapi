import {
  Controller,
  Get,
  Post,
  Put,
  Param,
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
import { ServiceService } from '../Service/ServiceService';
import ServiceCreationDTO from '../DTO/ServiceCreationDTO';

@Controller('service')
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Get()
  @UseGuards(AuthGuard)
  async list(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Res() res: Response,
  ) {
    const services = await this.serviceService.listByChurch(member.church);

    res.status(HttpStatus.OK).json(services.map((s) => s.toRaw()));
  }

  @Get(':uid')
  @UseGuards(AuthGuard)
  async get(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Param('uid') uid: string,
    @Res() res: Response,
  ) {
    const service = await this.serviceService.getByUid(uid, member.church);
    if (!service) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Culto não encontrado' });

      return;
    }

    res.status(HttpStatus.OK).json(service.toRaw());
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Body() body: ServiceCreationDTO,
    @Res() res: Response,
  ) {
    const validation = Validate(ServiceCreationDTO, body);
    if (validation.error) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: validation.error.message });

      return;
    }

    const service = await this.serviceService.create(body, member.church);

    res.status(HttpStatus.CREATED).json(service.toRaw());
  }

  @Put(':uid')
  @UseGuards(AuthGuard)
  async update(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Param('uid') uid: string,
    @Body() body: ServiceCreationDTO,
    @Res() res: Response,
  ) {
    const validation = Validate(ServiceCreationDTO, body);
    if (validation.error) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: validation.error.message });

      return;
    }

    const service = await this.serviceService.update(uid, member.church, body);

    res.status(HttpStatus.OK).json(service.toRaw());
  }
}