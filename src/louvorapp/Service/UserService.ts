import { Injectable } from '@nestjs/common';
import UidManager from "../Util/UidManager";
import UserRepository from "../Repository/UserRepository";
import User from '../Entity/User';
import UserCreationDTO from '../DTO/UserCreationDTO';

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

  public async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }

  public async createFromCreationDto(userDto: UserCreationDTO): Promise<User> {
    let user = new User();
    user.uid = UidManager.generate('user');
    user.email = userDto.email;
    await user.setPassword(userDto.password);
    user.dob = new Date(userDto.dob);
    user.name = userDto.name;
    user.updatedAt = new Date();
    user.createdAt =  new Date();

    await this.userRepository.persist(user);

    return user;
  }

  public async getByUserUidAndAccessToken(userUid: string, accessToken: string): Promise<User> {
    return await this.userRepository.findByUserUidAndAccessToken(userUid, accessToken);
  }
}
