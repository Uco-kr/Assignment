import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

type GoogleUser = {
  email: string;
  firstName: string;
  lastName: string;
};
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    Username: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    console.log('input username:', Username);
    const user = await this.usersService.findOne(Username);
    console.log('db user:', user);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: Omit<User, 'password'>): { access_token: string } {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(googleUser: GoogleUser) {
    if (!googleUser) {
      throw new BadRequestException('Unauthenticated');
    }

    let user = await this.usersService.findOneByEmail(googleUser.email);

    if (!user) {
      const password = Math.random();

      user = await this.usersService.create({
        email: googleUser.email,
        name: `${googleUser.lastName}${googleUser.firstName}`,
        password: `${password}`,
      });
    }

    return this.login(user);
  }
}
