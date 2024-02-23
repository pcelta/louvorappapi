import { Controller, Get, Post, Res, Param, HttpStatus, Body, UseGuards } from '@nestjs/common';
import { Validate } from "joi-typescript-validator"
import { Response } from 'express';
import MemberCreationDTO from '../DTO/UserCreationDTO';
import UserService from '../Service/UserService';
import UserCreationDTO from '../DTO/UserCreationDTO';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':emailOrUid')
  async get(@Param() params: any, @Res() res: Response) {
    const user = await this.userService.getByEmail(params.emailOrUid);

    if (user !== null) {
      res.status(HttpStatus.OK).json(user.toRaw());

      return;
    }

    res.status(HttpStatus.NOT_FOUND).json({ message: 'User Not Found!'});
 }

 @Post()
 async create(@Body() body: UserCreationDTO, @Res() res: Response) {
  const validation = await Validate(UserCreationDTO, body);
  if (validation.error) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: validation.error.message});

    return;
  }

  const existingUser = await this.userService.getByEmail(body.email);

  if (existingUser !== null) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: 'Email Address already in use!'});

    return;
  }

  const user = await this.userService.createFromCreationDto(body as UserCreationDTO);

  res.status(HttpStatus.CREATED).json(user.toRaw());
 }
}
