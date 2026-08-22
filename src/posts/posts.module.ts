import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Repository } from './repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AlarmModule } from '../alarm/alarm.module';

@Module({
  imports: [PrismaModule, AlarmModule],
  controllers: [PostsController],
  providers: [PostsService, Repository],
})
export class PostsModule {}
