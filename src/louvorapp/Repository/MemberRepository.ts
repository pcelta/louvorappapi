import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { Member } from '@prisma/client';

@Injectable()
export class MemberRepository extends AbstractRepository {
  public async findByEmail(email: string): Promise<Member> {
    const member = await this.prismaClient.member.findFirstOrThrow({
      where: {
        user: {
          email: email
        }
      },
      include: {
        user: true
      }
    });

    return member;
  }

  public async persist(member: Member): Promise<Member> {
    delete member['id'];

    return this.prismaClient.member.create({ data: { ...member } });
  }
}
