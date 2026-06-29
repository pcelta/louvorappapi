import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MemberService } from './Service/MemberService';
import { MemberRepository } from './Repository/MemberRepository';
import UserService from './Service/UserService';
import UserRepository from './Repository/UserRepository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MemberRoleRepository } from './Repository/MemberRoleRepository';
import { RoleRepository } from './Repository/RoleRepository';
import { MemberRoleService } from './Service/MemberRoleService';
import ChurchRepository from './Repository/ChurchRepository';
import { ChurchService } from './Service/ChurchService';
import { UserController } from './Controller/UserController';
import { JwtModule } from '@nestjs/jwt';
import AuthService from './Service/AuthService';
import UserAccessRepository from './Repository/UserAccessRepository';
import { AuthController } from './Controller/AuthController';
import { JwtToMemberPipe } from './Util/JwtToMemberPipe';
import { ChurchController } from './Controller/ChurchController';
import { MemberController } from './Controller/MemberController';
import { MemberInvitationController } from './Controller/MemberInvitationController';
import { MemberInvitationService } from './Service/MemberInvitationService';
import { MemberInvitationRepository } from './Repository/MemberInvitationRepository';
import { SkillController } from './Controller/SkillController';
import { SkillService } from './Service/SkillService';
import { SkillRepository } from './Repository/SkillRepository';
import { MemberSkillsService } from './Service/MemberSkillsService';
import { MemberSkillsRepository } from './Repository/MemberSkillsRepository';
import { ArtistController } from './Controller/ArtistController';
import { ArtistService } from './Service/ArtistService';
import { ArtistRepository } from './Repository/ArtistRepository';
import { SongController } from './Controller/SongController';
import { SongService } from './Service/SongService';
import { SongRepository } from './Repository/SongRepository';
import { SongLinkRepository } from './Repository/SongLinkRepository';
import { ServiceController } from './Controller/ServiceController';
import { ServiceService } from './Service/ServiceService';
import { ServiceRepository } from './Repository/ServiceRepository';
import { ServicePastorRepository } from './Repository/ServicePastorRepository';
import { RoleController } from './Controller/RoleController';
import { RoleService } from './Service/RoleService';
import { WorshipController } from './Controller/WorshipController';
import { WorshipService } from './Service/WorshipService';
import { WorshipRepository } from './Repository/WorshipRepository';
import { WorshipSongRepository } from './Repository/WorshipSongRepository';
import { WorshipTeamRosterRepository } from './Repository/WorshipTeamRosterRepository';
import { JwtToUserPipe } from './Util/JwtToUserPiper';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot({
      entities: ['./dist/louvorapp/Entity'],
      entitiesTs: ['./src/louvorapp/Entity'],
      dbName: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      driver: PostgreSqlDriver,
    }),
    // add this secret to .env
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5 days' },
    }),
  ],
  providers: [
    JwtToUserPipe,
    JwtToMemberPipe,

    // services
    MemberService,
    UserService,
    MemberRoleService,
    ChurchService,
    AuthService,
    MemberInvitationService,
    SkillService,
    MemberSkillsService,
    ArtistService,
    SongService,
    ServiceService,
    RoleService,
    WorshipService,

    // repositories
    MemberRepository,
    UserRepository,
    MemberRoleRepository,
    RoleRepository,
    ChurchRepository,
    UserAccessRepository,
    MemberInvitationRepository,
    SkillRepository,
    MemberSkillsRepository,
    ArtistRepository,
    SongRepository,
    SongLinkRepository,
    ServiceRepository,
    ServicePastorRepository,
    WorshipRepository,
    WorshipSongRepository,
    WorshipTeamRosterRepository,
  ],
  controllers: [
    UserController,
    AuthController,
    ChurchController,
    MemberController,
    MemberInvitationController,
    SkillController,
    ArtistController,
    SongController,
    ServiceController,
    RoleController,
    WorshipController,
  ],
})
export class LouvorappModule {}
