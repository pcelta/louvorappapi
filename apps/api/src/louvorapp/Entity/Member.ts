import {
  Collection,
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
  OneToMany,
  ManyToOne,
} from '@mikro-orm/core';
import User from './User';
import { MemberRole } from './MemberRole';
import { MemberSkills } from './MemberSkills';
import { MemberInvitation } from './MemberInvitation';
import Church from './Church';

@Entity({ tableName: 'members' })
export default class Member {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  uid: string;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, { joinColumn: 'fk_user' })
  user: User;

  @OneToMany({
    entity: () => MemberRole,
    mappedBy: 'member',
    orphanRemoval: true,
  })
  memberRoles: Collection<MemberRole>;

  @OneToMany({
    entity: () => MemberSkills,
    mappedBy: 'member',
    orphanRemoval: true,
  })
  memberSkills: Collection<MemberSkills>;

  @OneToMany({ entity: () => MemberInvitation, mappedBy: 'member' })
  invitations: Collection<MemberInvitation>;

  @ManyToOne({ joinColumn: 'fk_church', entity: () => Church })
  church: Church;

  private pendingInviteCode(): string | null {
    if (!this.invitations?.isInitialized()) {
      return null;
    }

    const pending = this.invitations.getItems().find((i) => !i.accepted);

    return pending ? pending.code : null;
  }

  public toRaw() {
    return {
      uid: this.uid,
      createdAt: this.createdAt,
      user: this.user.toRaw(),
      church: this.church.toRaw(),
      roles: this.memberRoles?.isInitialized()
        ? this.memberRoles
            .getItems()
            .map((mr) => ({ slug: mr.role.slug, name: mr.role.name }))
        : [],
      skills: this.memberSkills?.isInitialized()
        ? this.memberSkills
            .getItems()
            .map((ms) => ({
              slug: ms.skill.slug,
              name: ms.skill.name,
              icon: ms.skill.icon,
            }))
        : [],
      pending: !this.user.password,
      invite_code: this.pendingInviteCode(),
    };
  }
}
