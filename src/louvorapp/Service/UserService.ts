import { Injectable } from '@nestjs/common';
import UidManager from "../Util/UidManager";
import UserRepository from "../Repository/UserRepository";
import User from '../Entity/User';

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async create(user: User): Promise<User> {
    const uid = UidManager.generate('user');
    user.uid = uid;

    user.setPassword(user.password);

    this.userRepository.persist(user);

    return user;
  }
}
