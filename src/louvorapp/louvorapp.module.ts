import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './Service/MemberService';
import { MemberRepository } from './Repository/MemberRepository';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [],
  providers: [
    {
      provide: 'PrismaClient',
      useValue: new PrismaClient()
    },
    MemberService,
    MemberRepository
  ],
  controllers: [
    MemberController
  ]
})
export class LouvorappModule {}
