import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import Member from '../Entity/Member';

@Injectable()
export class MemberRepository extends AbstractRepository {
  public async findByEmail(email: string): Promise<Member> {
    const queryBuilder = this.em.createQueryBuilder(Member, 'm');
    const member = await queryBuilder
      .select(['m.*'], true)
      .join('m.user', 'u')
      .where({ 'u.email': email })
      .getSingleResult();

    return member;
  }

  public async persist(member: Member) {
    delete member['id'];
    await this.em.persist(member).flush();
  }

  public async findByChurch(churchId: number): Promise<Member[]> {
    return await this.em.find(
      Member,
      { church: churchId },
      {
        populate: ['user', 'church', 'memberRoles', 'memberRoles.role'],
        orderBy: { createdAt: 'asc' },
      },
    );
  }

  public async findByUserUidAndAccessToken(
    uid: string,
    accessToken: string,
  ): Promise<Member> {
    return await this.em.findOne(
      Member,
      { user: { uid, access: { accessToken } } },
      { populate: ['user', 'church'] },
    );
  }
}
