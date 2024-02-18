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
  constructor(private readonly roleRepository: RoleRepository, private readonly memberRoleRepository: MemberRoleRepository) {}

  public async addDefaultRole(member: Member): Promise<void> {
    let defaultRole = await this.roleRepository.findBySlug(Role.ROLE_MEMBER);

    let memberRole = new MemberRole();
    memberRole.member = member;
    memberRole.role = defaultRole;
    memberRole.updatedAt = new Date();
    memberRole.createdAt = new Date();

    this.memberRoleRepository.persist(memberRole);
  }
}
