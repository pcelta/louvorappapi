import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../Repository/MemberRepository';
import MemberCreationDTO from '../DTO/UserCreationDTO';
import UserService from './UserService';
import UidManager from '../Util/UidManager';
import Member from '../Entity/Member';
import User from '../Entity/User';
import { MemberRoleService } from './MemberRoleService';
import Church from '../Entity/Church';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository, private readonly userService: UserService, private readonly memberRoleService: MemberRoleService) {}

  public async getMemberByEmail(email: string): Promise<Member> {
    try {
      const member = await this.memberRepository.findByEmail(email);

      return member;
    } catch (e) {
      return null
    }
  }

  public async getMemberByUserUidAndAccessToken(userUid: string, accessToken: string): Promise<Member> {
    return await this.memberRepository.findByUserUidAndAccessToken(userUid, accessToken);
  }

  public async createAdmin(user: User, church: Church): Promise<Member> {
    const member = new Member();
    member.uid = UidManager.generate('member');
    member.church = church
    member.user = user;
    member.createdAt = new Date();
    member.updatedAt = new Date();

    await this.memberRepository.persist(member);
    await this.memberRoleService.addAdminRole(member);

    return member;
  }
}
