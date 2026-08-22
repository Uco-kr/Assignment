import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { pushResponse } from './alarm.type';

@Injectable()
export class AlarmService {
  private readonly pushURL: string;
  constructor(private readonly httpService: HttpService) {
    this.pushURL = process.env.pushURL ?? '';
  }

  async push(deviceId: string[]): Promise<void> {
    const push = deviceId.map(
      async (id) =>
        await firstValueFrom(
          this.httpService.post<pushResponse>(this.pushURL + '/api/push', {
            deviceid: id,
          }),
        ),
    );
    const responses = await Promise.all(push);
    const failed = responses
      .filter((res) => res.data.resultCode == '-1')
      .map((res) => res.data.resultData.deviceId);
    if (failed.length > 0) {
      await this.push(failed);
    }
  }
}
