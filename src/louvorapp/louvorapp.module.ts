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
import { MemberController } from './Controller/MemberController';
import { JwtModule } from '@nestjs/jwt';
import AuthService from './Service/AuthService';
import UserAccessRepository from './Repository/UserAccessRepository';
import { AuthController } from './Controller/AuthController';
import { JwtToMemberPipe } from './Util/JwtToMemberPipe';
import { ChurchController } from './Controller/ChurchController';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot({
      entities: ['./dist/louvorapp/Entity'],
      entitiesTs: ['./src/louvorapp/Entity'],
      dbName: 'louvorappdb',
      user: 'postgres',
      password: 'rock4me!!',
      host: 'localhost',
      port: 5432,
      driver: PostgreSqlDriver
    }),
    // add this secret to .env
    JwtModule.register({ secret: '!louvorapp-secrete123456789@@!', signOptions: { expiresIn: '5 days' } }),
  ],
  providers: [
    JwtToMemberPipe,

    MemberService,
    UserService,
    MemberRoleService,
    ChurchService,
    AuthService,
    MemberRepository,
    UserRepository,
    MemberRoleRepository,
    RoleRepository,
    ChurchRepository,
    UserAccessRepository,
  ],
  controllers: [
    MemberController,
    AuthController,
    ChurchController,
  ]
})
export class LouvorappModule {}
