import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import Member from './Member';

@Entity({ tableName: 'member_invitation' })
export class MemberInvitation {
  public static DAYS_TO_EXPIRE = 7;

  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: true })
  code: string;

  @Property({ type: 'datetime', fieldName: 'expires_at' })
  expiresAt: Date;

  @Property({ type: 'boolean', default: false })
  accepted: boolean;

  @Property({ type: 'datetime', fieldName: 'accepted_at', nullable: true })
  acceptedAt?: Date;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @ManyToOne({ joinColumn: 'fk_member', entity: () => Member })
  member: Member;

  public isExpired(): boolean {
    return this.expiresAt.getTime() < new Date().getTime();
  }

  public toRaw() {
    return {
      code: this.code,
      accepted: this.accepted,
      accepted_at: this.acceptedAt,
      expires_at: this.expiresAt,
      member: {
        user: {
          name: this.member.user.name,
          email: this.member.user.email,
        },
        church: {
          name: this.member.church.name,
          logo_path: this.member.church.logoPath,
        },
      },
    };
  }
}