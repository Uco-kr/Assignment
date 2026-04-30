import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { Repository } from './repository';
import { UserController } from './users.controller';

@Module({
  controllers: [UserController],
  providers: [UsersService, Repository],
  exports: [UsersService],
})
export class UsersModule {}
