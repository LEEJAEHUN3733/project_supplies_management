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

@ApiTags('카테고리 관리 API') // Swagger API 명세서에서 카테고리 관리 API로 그룹화
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
    status: 201, // 요청이 성공적으로 처리된 경우 HTTP 201 응답
    description: '카테고리가 정상적으로 등록되었습니다.',
    type: Category,
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto, // HTTP 요청의 본문을 DTO로 매핑
  ): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto); // 서비스에서 카테고리 등록 처리
  }

  // 전체 카테고리 목록 조회
  @Get()
  @ApiOperation({
    summary: '전체 카테고리 목록 조회',
    description: '전체 카테고리 목록을 반환합니다.',
  })
  @ApiResponse({
    status: 200, // 요청이 성공적으로 처리된 경우 HTTP 200 응답
    description: '카테고리 리스트 반환',
    type: [Category], // 반환될 데이터 타입(카테고리 목록)
  })
  async getCategories(): Promise<Category[]> {
    return this.categoryService.getCategories(); // 서비스에서 전체 카테고리 목록 조회 처리
  }

  // 카테고리 갱신
  @Patch(':id')
  @ApiOperation({
    summary: '카테고리 갱신',
    description: '카테고리 정보를 갱신합니다.',
  })
  @ApiResponse({
    status: 200, // 요청이 성공적으로 처리된 경우 HTTP 200 응답
    description: '카테고리가 성공적으로 수정되었습니다.',
    type: Category, // 반환될 데이터 타입(수정된 카테고리)
  })
  @ApiResponse({
    status: 404, // 요청한 카테고리가 존재하지 않으면 HTTP 404 응답
    description: '카테고리를 찾을 수 없습니다.',
  })
  async updateCategory(
    @Param('id') id: number, // URL 경로에서 카테고리 ID를 가져옴
    @Body() updateCategoryDto: UpdateCategoryDto, // HTTP 요청 본문에서 갱신할 카테고리 정보 받음
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto); // 서비스에서 카테고리 갱신 처리
  }

  // 카테고리 삭제
  @Delete(':id')
  @ApiOperation({
    summary: '카테고리 삭제',
    description: '카테고리를 삭제합니다.',
  })
  @ApiResponse({
    status: 200, // 요청이 성공적으로 처리된 경우 HTTP 200 응답
    description: '카테고리가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: 404, // 요청한 카테고리가 존재하지 않으면 HTTP 404 응답
    description: '카테고리를 찾을 수 없습니다.',
  })
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return this.categoryService.deleteCategory(id); // 서비스에서 카테고리 삭제 처리
  }
}
