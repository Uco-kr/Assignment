import { Module } from '@nestjs/common';
import { infoteamAccountService } from './infoteam-account.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [infoteamAccountService],
  exports: [infoteamAccountService], // 👈 핵심: AuthModule에서 주입받을 수 있도록 내보냅니다!
})
export class InfoteamAccountModule {}
