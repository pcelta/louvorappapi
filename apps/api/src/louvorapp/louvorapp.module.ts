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

    // repositories
    MemberRepository,
    UserRepository,
    MemberRoleRepository,
    RoleRepository,
    ChurchRepository,
    UserAccessRepository,
    MemberInvitationRepository,
  ],
  controllers: [
    UserController,
    AuthController,
    ChurchController,
    MemberController,
    MemberInvitationController,
  ],
})
export class LouvorappModule {}
