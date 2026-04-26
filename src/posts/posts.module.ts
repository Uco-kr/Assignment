import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Repository } from './repository';

@Module({
  controllers: [PostsController],
  providers: [PostsService, Repository],
  exports: [PostsService],
})
export class PostsModule {}
