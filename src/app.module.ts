import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { AlarmModule } from './alarm/alarm.module';

@Module({
  imports: [PostsModule, AuthModule, UsersModule, CategoryModule, AlarmModule],
  controllers: [CategoryController],
  providers: [AppService],
})
export class AppModule {}
