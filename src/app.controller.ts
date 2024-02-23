import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(@Res() res: Response) {
    res.status(HttpStatus.OK).json({ message: "Louvorapp API is up and running!"});
 }
}
