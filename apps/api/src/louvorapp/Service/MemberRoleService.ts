import { Injectable } from '@nestjs/common';
import UidManager from '../Util/UidManager';
import Member from '../Entity/Member';
import User from '../Entity/User';
import { RoleRepository } from '../Repository/RoleRepository';
import { Role } from '../Entity/Role';
import { MemberRole } from '../Entity/MemberRole';
import { MemberRoleRepository } from '../Repository/MemberRoleRepository';

@Injectable()
export class MemberRoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly memberRoleRepository: MemberRoleRepository,
  ) {}

  public async addRoleBySlug(member: Member, slug: string): Promise<void> {
    let role = await this.roleRepository.findBySlug(slug);

    let memberRole = new MemberRole();
    memberRole.member = member;
    memberRole.role = role;
    memberRole.updatedAt = new Date();
    memberRole.createdAt = new Date();

    await this.memberRoleRepository.persist(memberRole);
  }

  public async addAdminRole(member: Member): Promise<void> {
    await this.addRoleBySlug(member, Role.ROLE_ADMIN);
  }
}
