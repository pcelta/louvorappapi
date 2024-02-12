import { Injectable } from '@nestjs/common';
import { User } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import UidManager from "../Util/UidManager";
import UserRepository from "../Repository/UserRepository";

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  public async create(user: User): Promise<User> {
    const uid = UidManager.generate('user');
    user.uid = uid;

    const saltOrRounds = 15;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
    user.password = hashedPassword;

    return this.userRepository.persist(user);
  }
}
