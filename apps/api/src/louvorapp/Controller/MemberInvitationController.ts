import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { MemberInvitationService } from '../Service/MemberInvitationService';
import { avatarStorage } from '../Util/AvatarStorage';

const E164 = /^\+[1-9]\d{1,14}$/;

@Controller('member-invitation')
export class MemberInvitationController {
  constructor(private service: MemberInvitationService) {}

  @Get(':code')
  async get(@Param('code') code: string, @Res() res: Response) {
    const invitation = await this.service.getByCode(code);

    res.status(HttpStatus.OK).json(invitation.toRaw());
  }

  @Post(':code/accept')
  @UseInterceptors(FileInterceptor('photo', { storage: avatarStorage }))
  async accept(
    @Param('code') code: string,
    @Body() body: { password?: string; phone?: string; skills?: string },
    @UploadedFile() photo: Express.Multer.File,
    @Res() res: Response,
  ) {
    const password = body.password ?? '';
    const phone = body.phone ?? '';
    const skills = this.parseSkills(body.skills);

    if (password.length < 8 || password.length > 30) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: 'A senha deve ter entre 8 e 30 caracteres' });

      return;
    }

    if (!E164.test(phone)) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'Telefone deve estar no formato internacional, ex: +5511999999999',
      });

      return;
    }

    const photoPath = photo ? `/uploads/avatars/${photo.filename}` : undefined;

    await this.service.accept(code, password, phone, photoPath, skills);

    res.status(HttpStatus.OK).json({ message: 'Convite aceito' });
  }

  private parseSkills(raw?: string): string[] {
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
}