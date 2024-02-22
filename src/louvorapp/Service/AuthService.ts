import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from "../Entity/User";
import UserAccess from "../Entity/UserAccess";
import UidManager from "../Util/UidManager";
import UserRepository from '../Repository/UserRepository';
import UserAccessRepository from '../Repository/UserAccessRepository';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class AuthService {
  constructor(private readonly userRepository: UserRepository, private readonly accessRepository: UserAccessRepository, private readonly jwtService: JwtService) {}

  public createAccess(user: User): UserAccess {
    let access = new UserAccess();
    access.user = user;
    access.accessTokenExpiresdAt = this.createTokenExpireDate(UserAccess.ACCESS_TOKEN_DAYS_TO_EXPIRE);
    access.accessToken = UidManager.generateToken();

    access.accessTokenCreatedAt = new Date();

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

  public async authenticate(user: User): Promise<User> {
    const foundUser = await this.userRepository.findByEmail(user.email);
    if (!foundUser) {
      return null;
    }

    const matched = await bcrypt.compare(user.password, foundUser.password);
    if (matched) {
      return foundUser;
    }

    return null;
  }

  public async createJwtToken(user: User): Promise<string> {
    const payload = { uid: user.uid, access_token: user.access.accessToken };

    return await this.jwtService.signAsync(payload);
  }
}
