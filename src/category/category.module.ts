// category.module.ts
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService], // 🔥 다른 모듈(예: PostModule)에서 카테고리 검증이 필요할 때 쓸 수 있게 내보냄
})
export class CategoryModule {}
