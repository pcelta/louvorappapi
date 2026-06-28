import { Controller, Get, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../Util/AuthGuard';
import { RoleService } from '../Service/RoleService';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  @UseGuards(AuthGuard)
  async list(@Res() res: Response) {
    const roles = await this.roleService.listAll();

    res
      .status(HttpStatus.OK)
      .json(roles.map((r) => ({ slug: r.slug, name: r.name })));
  }
}