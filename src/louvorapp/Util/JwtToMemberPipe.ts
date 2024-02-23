import { ArgumentMetadata, Injectable, PipeTransform, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MemberService } from '../Service/MemberService';

@Injectable()
export class JwtToMemberPipe implements PipeTransform {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly memberService: MemberService
  ) { }

  public async transform(token: string, _metadata: ArgumentMetadata) {
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get('JWT_SECRET')
        }
      );

      const member = await this.memberService.getMemberByUserUidAndAccessToken(payload.uid, payload.access_token);

      if (!member) {
        throw new UnauthorizedException("Invalid Member");
      }

      return member;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException("Invalid Token");
    }
  }
}
