import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Validate } from 'joi-typescript-validator';
import { Response } from 'express';
import { AuthGuard } from '../Util/AuthGuard';
import { ExtractJwtData } from '../Util/ExtractJwtDecorator';
import { JwtToMemberPipe } from '../Util/JwtToMemberPipe';
import { avatarStorage } from '../Util/AvatarStorage';
import Member from '../Entity/Member';
import { MemberService } from '../Service/MemberService';
import MemberInviteDTO from '../DTO/MemberInviteDTO';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async me(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Res() res: Response,
  ) {
    res.status(HttpStatus.OK).json(member.toRaw());
  }

  @Get()
  @UseGuards(AuthGuard)
  async list(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Res() res: Response,
  ) {
    const members = await this.memberService.listByChurch(member.church);

    res.status(HttpStatus.OK).json(members.map((m) => m.toRaw()));
  }

  @Get('search')
  @UseGuards(AuthGuard)
  async search(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Query('role') role: string,
    @Query('q') q: string,
    @Res() res: Response,
  ) {
    const members = await this.memberService.searchByRole(
      member.church,
      role ?? '',
      q ?? '',
    );

    res
      .status(HttpStatus.OK)
      .json(members.map((m) => ({ uid: m.uid, name: m.user.name })));
  }

  @Post()
  @UseGuards(AuthGuard)
  async add(
    @ExtractJwtData(JwtToMemberPipe) admin: Member,
    @Body() body: MemberInviteDTO,
    @Res() res: Response,
  ) {
    const validation = Validate(MemberInviteDTO, body);
    if (validation.error) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: validation.error.message });

      return;
    }

    const { member, invitation } = await this.memberService.invite(
      body.name,
      body.email,
      admin.church,
      body.skills ?? [],
      body.roles ?? [],
    );

    res.status(HttpStatus.CREATED).json({
      member: member.toRaw(),
      invitation: {
        code: invitation.code,
        path: `/member-invitation/${invitation.code}`,
        expires_at: invitation.expiresAt,
      },
    });
  }

  @Put('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('photo', { storage: avatarStorage }))
  async updateProfile(
    @ExtractJwtData(JwtToMemberPipe) member: Member,
    @Body()
    body: { name?: string; email?: string; password?: string; skills?: string },
    @UploadedFile() photo: Express.Multer.File,
    @Res() res: Response,
  ) {
    const name = (body.name ?? '').trim();
    const email = (body.email ?? '').trim();
    const password = body.password ?? '';

    if (!name) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: 'Informe o nome' });
      return;
    }
    if (!EMAIL.test(email)) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: 'Informe um email válido' });
      return;
    }
    if (password && (password.length < 8 || password.length > 30)) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: 'A senha deve ter entre 8 e 30 caracteres' });
      return;
    }

    const photoPath = photo ? `/uploads/avatars/${photo.filename}` : undefined;

    await this.memberService.updateProfile(member, {
      name,
      email,
      password: password || undefined,
      photoPath,
      skills: this.parseSkills(body.skills),
    });

    res.status(HttpStatus.OK).json({ message: 'Perfil atualizado' });
  }

  @Put(':uid/skills')
  @UseGuards(AuthGuard)
  async updateSkills(
    @ExtractJwtData(JwtToMemberPipe) admin: Member,
    @Param('uid') uid: string,
    @Body() body: { skills?: string[] },
    @Res() res: Response,
  ) {
    await this.memberService.updateSkills(uid, admin.church, body.skills ?? []);

    res.status(HttpStatus.OK).json({ message: 'Habilidades atualizadas' });
  }

  @Put(':uid/roles')
  @UseGuards(AuthGuard)
  async updateRoles(
    @ExtractJwtData(JwtToMemberPipe) admin: Member,
    @Param('uid') uid: string,
    @Body() body: { roles?: string[] },
    @Res() res: Response,
  ) {
    await this.memberService.updateRoles(uid, admin.church, body.roles ?? []);

    res.status(HttpStatus.OK).json({ message: 'Funções atualizadas' });
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