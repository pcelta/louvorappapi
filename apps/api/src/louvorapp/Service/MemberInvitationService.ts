import {
  ConflictException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import UidManager from '../Util/UidManager';
import { MemberInvitation } from '../Entity/MemberInvitation';
import { MemberInvitationRepository } from '../Repository/MemberInvitationRepository';
import Member from '../Entity/Member';

@Injectable()
export class MemberInvitationService {
  constructor(private readonly repository: MemberInvitationRepository) {}

  public async createForMember(member: Member): Promise<MemberInvitation> {
    const invitation = new MemberInvitation();
    invitation.code = UidManager.generateToken();
    invitation.accepted = false;
    invitation.createdAt = new Date();
    invitation.expiresAt = this.expiryDate(MemberInvitation.DAYS_TO_EXPIRE);
    invitation.member = member;

    await this.repository.persist(invitation);

    return invitation;
  }

  public async getByCode(code: string): Promise<MemberInvitation> {
    const invitation = await this.repository.findByCode(code);
    if (!invitation) {
      throw new NotFoundException('Convite não encontrado');
    }

    return invitation;
  }

  public async accept(
    code: string,
    password: string,
    phone: string,
    photoPath?: string,
  ): Promise<void> {
    const invitation = await this.getByCode(code);

    if (invitation.accepted) {
      throw new ConflictException('Convite já foi aceito');
    }

    if (invitation.isExpired()) {
      throw new GoneException('Convite expirado');
    }

    const user = invitation.member.user;
    await user.setPassword(password);
    user.phone = phone;
    if (photoPath) {
      user.photoPath = photoPath;
    }
    user.updatedAt = new Date();

    invitation.accepted = true;
    invitation.acceptedAt = new Date();

    await this.repository.flush();
  }

  private expiryDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return date;
  }
}