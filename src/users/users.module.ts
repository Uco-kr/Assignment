import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { Repository } from './repository';

@Module({
  providers: [UsersService, Repository],
  exports: [UsersService],
})
export class UsersModule {}
