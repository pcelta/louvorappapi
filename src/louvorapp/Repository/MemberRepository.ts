import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import Member from '../Entity/Member';

@Injectable()
export class MemberRepository extends AbstractRepository {
  public async findByEmail(email: string): Promise<Member> {
    const queryBuilder = this.em.createQueryBuilder(Member, 'm');
    const member = await queryBuilder.select(['m.*'], true)
      .join('m.user', 'u')
      .where({ 'u.email': email })
      .getSingleResult();

    return member;
  }

  public async persist(member: Member) {
    delete member['id'];
    this.em.persist(member).flush();
  }

  public async findByUserUidAndAccessToken(uid: string, accessToken: string): Promise<Member> {
    const queryBuilder = this.em.createQueryBuilder(Member, 'm');
    const member = await queryBuilder.select(['m.*', 'u.*'], true)
      .join('m.user', 'u')
      .join('u.access', 'ua')
      .where({ 'u.uid': uid, 'ua.access_token':  accessToken })
      .getSingleResult();

    return member;
  }
}
