import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(data: AuthDto) {
    //generate the password hash
    const hash = await argon.hash(data.password);
    //save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          hashPassword: hash,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }

    //return the saved user
  }

  async login(dto: AuthDto) {
    //find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    //if user doesnt exist throw exception
    if (!user)
      throw new ForbiddenException(
        'Your email Does not exist',
      );
    //cmpare passwrd
    const pwMacthes = await argon.verify(
      user.hashPassword,
      dto.password,
    );
    // if password incrrect thrw exceptioon
    if (!pwMacthes)
      throw new ForbiddenException(
        'Incorrect Password',
      );

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '30m',
        secret: secret,
      },
    );
    return {
      access_token: token,
    };
  }
}
