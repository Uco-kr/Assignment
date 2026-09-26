import { Module } from '@nestjs/common';
import { PostsController } from './post.controller';
import { PostsService } from './post.service';
import { PostRepository } from './post.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AlarmModule } from '../alarm/alarm.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [PrismaModule, AlarmModule, CategoryModule],
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
})
export class PostsModule {}
