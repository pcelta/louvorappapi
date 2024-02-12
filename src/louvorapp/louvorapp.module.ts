import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './Service/MemberService';
import { MemberRepository } from './Repository/MemberRepository';
import { PrismaClient } from '@prisma/client';
import UserService from './Service/UserService';
import UserRepository from './Repository/UserRepository';

@Module({
  imports: [],
  providers: [
    {
      provide: 'PrismaClient',
      useValue: new PrismaClient()
    },
    MemberService,
    UserService,
    MemberRepository,
    UserRepository
  ],
  controllers: [
    MemberController
  ]
})
export class LouvorappModule {}
