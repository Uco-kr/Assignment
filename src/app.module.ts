import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PostsModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { AlarmModule } from './alarm/alarm.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostsModule,
    AuthModule,
    UserModule,
    CategoryModule,
    AlarmModule,
  ],
  controllers: [CategoryController],
  providers: [AppService],
})
export class AppModule {}
