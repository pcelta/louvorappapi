import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../Repository/MemberRepository';
import { Member } from '@prisma/client';
import MemberCreationDTO from '../DTO/MemberCreationDTO';
import UserService from './UserService';
import UidManager from '../Util/UidManager';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository, private readonly userService: UserService) {}

  public async getMemberByEmail(email: string): Promise<Member> {
    try {
      const member = await this.memberRepository.findByEmail(email);

      return member;
    } catch (e) {
      return null
    }
  }

  public async createFromCreationDto(memberDto: MemberCreationDTO): Promise<Member> {
    let user = {
      email: memberDto.email,
      password: memberDto.password,
      updated_at: new Date(),
      created_at: new Date(),
      uid: '',
      id: null
    }
    const justCreatedUser = await this.userService.create(user);

    const uid = UidManager.generate('member');
    let member = {
      uid: uid,
      dob: new Date(memberDto.dob),
      name: memberDto.name,
      updated_at: new Date(),
      created_at: new Date(),
      fk_user: justCreatedUser.id,
      id: null
    };
    const justCreatedMember = await this.memberRepository.persist(member);

    return justCreatedMember;
  }
}
