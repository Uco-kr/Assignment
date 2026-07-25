import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserInfo } from './UserInfo';
import { firstValueFrom, catchError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { IdpUserInfoResponse } from './idp.type';
import { AxiosError } from 'axios';

@Injectable()
export class infoteamAccountService {
  private readonly idpUrl: string;
  constructor(private readonly httpService: HttpService) {
    this.idpUrl = process.env.idpUrl ?? '';
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    const userInfoResponse = await firstValueFrom(
      this.httpService
        .get<IdpUserInfoResponse>(this.idpUrl + '/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
              throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
          }),
        ),
    );
    const { sub: uuid, name, email } = userInfoResponse.data;
    return { uuid, name, email };
  }
}
