import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import UidManager from "../Util/UidManager";
import UserRepository from "../Repository/UserRepository";
import User from '../Entity/User';
import UserAccess from '../Entity/UserAccess';

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async create(user: User): Promise<User> {
    const uid = UidManager.generate('user');
    user.uid = uid;

    const saltOrRounds = 15;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
    user.password = hashedPassword;

    this.userRepository.persist(user);

    await this.createAccess(user);

    return user;
  }

  private async createAccess(user: User): Promise<UserAccess> {
    let access = new UserAccess();
    access.user = user;
    access.accessToken = UidManager.generateToken();
    access.accessTokenExpiresdAt = this.createTokenExpireDate(UserAccess.ACCESS_TOKEN_DAYS_TO_EXPIRE);
    access.accessTokenCreatedAt = new Date();

    access.refreshToken = UidManager.generateToken();
    access.refreshTokenCreatedAt = new Date();
    access.refreshTokenExpiresdAt = this.createTokenExpireDate(UserAccess.REFRESH_TOKEN_DAYS_TO_EXPIRE);

    access.createdAt = new Date();
    access.updatedAt = new Date();

    user.access = access;

    return access;
  }

  private createTokenExpireDate(daysToAdd: number): Date {
    let expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + daysToAdd)

    return expireDate;
  }
}
