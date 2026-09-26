import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { pushResponse } from './alarm.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlarmService {
  private readonly pushURL: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.pushURL = configService.get('pushUrL') ?? '';
  }

  async push(deviceId: string[], pushTry: number): Promise<void> {
    if (pushTry >= 3) {
      Logger.error(`${deviceId.join(', ')}에게 보내는 것을 실패하였습니다.`);
      return;
    }
    const push = deviceId.map(
      async (id) =>
        await firstValueFrom(
          this.httpService.post<pushResponse>(this.pushURL + '/api/push', {
            deviceid: id,
          }),
        ),
    );
    pushTry++;
    const responses = await Promise.all(push);
    const failed = responses
      .filter((res) => res.data.resultCode == '-1')
      .map((res) => res.data.resultData.deviceId);
    if (failed.length > 0) {
      await this.push(failed, pushTry);
    }
  }
}
