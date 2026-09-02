import { Module } from '@nestjs/common';
import { InfoteamAccountService } from './infoteam-account.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [InfoteamAccountService],
  exports: [InfoteamAccountService],
})
export class InfoteamAccountModule {}
