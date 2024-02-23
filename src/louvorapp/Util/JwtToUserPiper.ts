import { ArgumentMetadata, Injectable, PipeTransform, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MemberService } from '../Service/MemberService';
import UserService from '../Service/UserService';

@Injectable()
export class JwtToUserPipe implements PipeTransform {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) { }

  public async transform(token: string, _metadata: ArgumentMetadata) {
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get('JWT_SECRET')
        }
      );

      const user = await this.userService.getByUserUidAndAccessToken(payload.uid, payload.access_token);

      if (!user) {
        throw new UnauthorizedException("Invalid User");
      }

      return user;
    } catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException("Invalid Token");
    }
  }
}
