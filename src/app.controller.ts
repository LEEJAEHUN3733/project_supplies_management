import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { AppService } from './app.service';
import { Category } from './entities/category.entity';

@ApiTags('Category')
@Controller('category')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiOperation({
    summary: '새 카테고리 등록',
    description: '새로운 카테고리를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '카테고리가 정상적으로 등록되었습니다.',
  })
  // createCategory(@Body() createCategoryDto: CreateCategoryDto): any {
  //   return this.appService.getHello;
  // }
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
  getHello(): string {
    return this.appService.getHello();
  }
}
