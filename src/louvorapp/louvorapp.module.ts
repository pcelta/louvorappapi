import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
    JwtModule.register({ secret: '!louvorapp-secrete123456789@@!', signOptions: { expiresIn: `${60 * 60}s` } }),
  ],
  providers: [
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
  ]
})
export class LouvorappModule {}
