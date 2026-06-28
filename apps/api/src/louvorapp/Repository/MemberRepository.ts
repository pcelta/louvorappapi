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

  public async findByUidAndChurch(
    uid: string,
    churchId: number,
  ): Promise<Member> {
    return await this.em.findOne(Member, { uid, church: churchId });
  }

  public async findByUidsAndChurch(
    uids: string[],
    churchId: number,
  ): Promise<Member[]> {
    if (!uids.length) {
      return [];
    }

    return await this.em.find(Member, {
      uid: { $in: uids },
      church: churchId,
    });
  }

  public async searchByRoleAndChurch(
    churchId: number,
    roleSlug: string,
    query: string,
  ): Promise<Member[]> {
    const where: Record<string, unknown> = {
      church: churchId,
      memberRoles: { role: { slug: roleSlug } },
    };
    if (query) {
      where.user = { name: { $ilike: `%${query}%` } };
    }

    return await this.em.find(Member, where, {
      populate: ['user'],
      limit: 20,
    });
  }

  public async findByChurch(churchId: number): Promise<Member[]> {
    return await this.em.find(
      Member,
      { church: churchId },
      {
        populate: [
          'user',
          'church',
          'memberRoles',
          'memberRoles.role',
          'memberSkills',
          'memberSkills.skill',
          'invitations',
        ],
        orderBy: { user: { name: 'asc' } },
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
      { populate: ['user', 'church', 'memberSkills', 'memberSkills.skill'] },
    );
  }
}
