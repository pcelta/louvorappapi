import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MemberRepository } from '../Repository/MemberRepository';
import UserService from './UserService';
import UidManager from '../Util/UidManager';
import Member from '../Entity/Member';
import User from '../Entity/User';
import { MemberRoleService } from './MemberRoleService';
import { MemberInvitationService } from './MemberInvitationService';
import { MemberSkillsService } from './MemberSkillsService';
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
    private readonly memberSkillsService: MemberSkillsService,
  ) {}

  public async listByChurch(church: Church): Promise<Member[]> {
    return await this.memberRepository.findByChurch(church.id);
  }

  public async searchByRole(
    church: Church,
    roleSlug: string,
    query: string,
  ): Promise<Member[]> {
    return await this.memberRepository.searchByRoleAndChurch(
      church.id,
      roleSlug,
      query,
    );
  }

  public async updateProfile(
    member: Member,
    fields: {
      name?: string;
      email?: string;
      password?: string;
      photoPath?: string;
      skills?: string[];
    },
  ): Promise<void> {
    await this.userService.updateProfile(member.user, {
      name: fields.name,
      email: fields.email,
      password: fields.password,
      photoPath: fields.photoPath,
    });

    if (fields.skills) {
      await this.memberSkillsService.setForMember(member, fields.skills);
    }
  }

  public async updateRoles(
    uid: string,
    church: Church,
    roles: string[],
  ): Promise<void> {
    const member = await this.memberRepository.findByUidAndChurch(
      uid,
      church.id,
    );
    if (!member) {
      throw new NotFoundException('Membro não encontrado');
    }

    await this.memberRoleService.setForMember(member, roles);
  }

  public async updateSkills(
    uid: string,
    church: Church,
    skills: string[],
  ): Promise<void> {
    const member = await this.memberRepository.findByUidAndChurch(
      uid,
      church.id,
    );
    if (!member) {
      throw new NotFoundException('Membro não encontrado');
    }

    await this.memberSkillsService.setForMember(member, skills);
  }

  public async invite(
    name: string,
    email: string,
    church: Church,
    skills: string[] = [],
    roles: string[] = [],
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

    const finalRoles = roles.length
      ? roles
      : [Role.ROLE_MEMBER, Role.ROLE_WORSHIP_TEAM];
    await this.memberRoleService.setForMember(member, finalRoles);

    await this.memberSkillsService.setForMember(member, skills);

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
