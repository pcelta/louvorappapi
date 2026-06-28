import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../Repository/RoleRepository';
import { Role } from '../Entity/Role';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  public async listAll(): Promise<Role[]> {
    return await this.roleRepository.findAll();
  }
}