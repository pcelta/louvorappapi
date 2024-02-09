import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../Repository/MemberRepository';
import { Member } from '@prisma/client';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}
  public async getMemberByEmail(email: string): Promise<Member> {
    try {
      const member = await this.memberRepository.findByEmail(email);

      return member;
    } catch (e) {
      return null
    }
  }
}
