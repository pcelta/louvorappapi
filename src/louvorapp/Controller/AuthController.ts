import { Controller, Get, Post, Res, Param, HttpStatus, Body } from '@nestjs/common';
import { Validate } from "joi-typescript-validator"
import { Response } from 'express';
import SignInDTO from '../DTO/SignInDTO';
import AuthService from '../Service/AuthService';
import User from '../Entity/User';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, ) {}

  @Post('signin')
  async signIn(@Body() body: SignInDTO, @Res() res: Response) {
    const validation = Validate(SignInDTO, body);
    if (validation.error) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: validation.error.message});

      return;
    }

    const user = new User();
    user.email = body.email;
    user.password = body.password;

    const authenticatedUser = await this.authService.authenticate(user);
    if (authenticatedUser) {
      this.authService.createAccess(authenticatedUser);
      const jwt = await this.authService.createJwtToken(authenticatedUser);

      return res.status(HttpStatus.OK).json({access_token: jwt});
    }

    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Credentials failed'});
  }
}
