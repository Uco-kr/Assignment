import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'idp']) {
  override handleRequest(
    err: any,
    user: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ExecutionContext,
  ): any {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
