import { Injectable } from '@nestjs/common';
import { Role } from "../Entity/Role";
import { AbstractRepository } from "./AbstractRepository";
import { MemberRole } from '../Entity/MemberRole';

@Injectable()
export class RoleRepository extends AbstractRepository {

  public async findBySlug(slug: string): Promise<Role> {
    const queryBuilder = this.em.createQueryBuilder(Role, 'm');
    const role = await queryBuilder.select(['*'], true)
      .where({ 'slug': slug })
      .getSingleResult();

    return role;
  }
}
