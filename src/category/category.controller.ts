import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

  @Post()
  async createCategory(@Body('name') name: string) {
    return await this.CategoryService.CreateCategory(name);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return await this.CategoryService.DeleteCategory(id);
  }
}
