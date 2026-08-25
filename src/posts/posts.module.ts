import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostRepository } from './posts.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AlarmModule } from '../alarm/alarm.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [PrismaModule, AlarmModule, CategoryModule],
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
})
export class PostsModule {}
