import { ConflictException, Injectable } from '@nestjs/common';
import { MemberRepository } from '../Repository/MemberRepository';
import UserService from './UserService';
import UidManager from '../Util/UidManager';
import Member from '../Entity/Member';
import User from '../Entity/User';
import { MemberRoleService } from './MemberRoleService';
import { MemberInvitationService } from './MemberInvitationService';
import { MemberInvitation } from '../Entity/MemberInvitation';
import { Role } from '../Entity/Role';
import Church from '../Entity/Church';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly userService: UserService,
    private readonly memberRoleService: MemberRoleService,
    private readonly memberInvitationService: MemberInvitationService,
  ) {}

  public async listByChurch(church: Church): Promise<Member[]> {
    return await this.memberRepository.findByChurch(church.id);
  }

  public async invite(
    name: string,
    email: string,
    church: Church,
  ): Promise<{ member: Member; invitation: MemberInvitation }> {
    const existing = await this.userService.getByEmail(email);
    if (existing) {
      throw new ConflictException(`Email ${email} já está em uso`);
    }

    const user = await this.userService.createInvited(name, email);

    const member = new Member();
    member.uid = UidManager.generate('member');
    member.church = church;
    member.user = user;
    member.createdAt = new Date();
    member.updatedAt = new Date();
    await this.memberRepository.persist(member);

    await this.memberRoleService.addRoleBySlug(member, Role.ROLE_MEMBER);
    await this.memberRoleService.addRoleBySlug(member, Role.ROLE_WORSHIP_TEAM);

    const invitation = await this.memberInvitationService.createForMember(member);

    return { member, invitation };
  }

  public async getMemberByEmail(email: string): Promise<Member> {
    try {
      const member = await this.memberRepository.findByEmail(email);

      return member;
    } catch (e) {
      return null;
    }
  }

  public async getMemberByUserUidAndAccessToken(
    userUid: string,
    accessToken: string,
  ): Promise<Member> {
    return await this.memberRepository.findByUserUidAndAccessToken(
      userUid,
      accessToken,
    );
  }

  public async createAdmin(user: User, church: Church): Promise<Member> {
    const member = new Member();
    member.uid = UidManager.generate('member');
    member.church = church;
    member.user = user;
    member.createdAt = new Date();
    member.updatedAt = new Date();

    await this.memberRepository.persist(member);
    await this.memberRoleService.addAdminRole(member);

    return member;
  }
}
