import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './guard/jwt.strategy';
import { RefreshTokenRepository } from './refresh-token.repository';
import { InfoteamAccountModule } from '../infoteam-account/infoteam-account.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    InfoteamAccountModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenRepository],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
