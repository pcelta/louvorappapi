import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../Repository/MemberRepository';
import MemberCreationDTO from '../DTO/MemberCreationDTO';
import UserService from './UserService';
import UidManager from '../Util/UidManager';
import Member from '../Entity/Member';
import User from '../Entity/User';
import { MemberRoleService } from './MemberRoleService';

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

  public async createFromCreationDto(memberDto: MemberCreationDTO): Promise<Member> {
    let user = new User();
    user.email = memberDto.email;
    user.password = memberDto.password;
    user.updatedAt = new Date();
    user.createdAt =  new Date();

    await this.userService.create(user);

    const uid = UidManager.generate('member');
    let member = new Member();
    member.uid = uid;
    member.dob = new Date(memberDto.dob);
    member.name = memberDto.name;
    member.updatedAt = new Date();
    member.createdAt = new Date();
    member.user = user;

    await this.memberRepository.persist(member);
    await this.memberRoleService.addDefaultRole(member);

    return member;
  }
}
