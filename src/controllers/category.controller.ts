import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from '../dtos/category/create-category.dto';
import { UpdateCategoryDto } from '../dtos/category/update-category.dto';
import { CategoryService } from '../services/category.service';
import { Category } from '../entities/category.entity';

@ApiTags('카테고리 관리 API')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // 카테고리 등록
  @Post()
  @ApiOperation({
    summary: '새 카테고리 등록',
    description: '새로운 카테고리를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '카테고리가 정상적으로 등록되었습니다.',
    type: Category,
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }
  // 전체 카테고리 목록 조회
  @Get()
  @ApiOperation({
    summary: '전체 카테고리 목록 조회',
    description: '전체 카테고리 목록을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '카테고리 리스트 반환',
    type: [Category],
  })
  async getCategories(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }
  // 카테고리 갱신
  @Patch(':id')
  @ApiOperation({
    summary: '카테고리 갱신',
    description: '카테고리 정보를 갱신합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '카테고리가 성공적으로 수정되었습니다.',
    type: Category,
  })
  @ApiResponse({
    status: 404,
    description: '카테고리를 찾을 수 없습니다.',
  })
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }
  // 카테고리 삭제
  @Delete(':id')
  @ApiOperation({
    summary: '카테고리 삭제',
    description: '카테고리를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '카테고리가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '카테고리를 찾을 수 없습니다.',
  })
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
