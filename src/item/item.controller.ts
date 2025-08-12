import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from 'src/item/dtos/create-item.dto';
import { UpdateItemDto } from 'src/item/dtos/update-item.dto';
import { Item } from 'src/item/item.entity';
import { ItemCacheService } from 'src/item/item-cache.service';
import { ItemService } from 'src/item/item.service';

@ApiTags('비품 관리 API') // Swagger API 명세서에서 비품 관리 API로 그룹화
@Controller('items')
export class ItemController {
  constructor(
    private readonly itemService: ItemService, // 비품 관련 로직을 처리하는 서비스 주입
    private readonly itemCacheService: ItemCacheService, // 비품 캐시 관리 서비스 주입(Redis)
  ) {}

  // 새 비품 등록
  @Post()
  @ApiOperation({
    summary: '새 비품 등록',
    description: '새로운 비품을 특정 카테고리에 등록합니다',
  })
  @ApiResponse({
    status: 201, // 요청이 성공적으로 처리된 경우 HTTP 201 응답
    description: '비품이 성공적으로 등록되었습니다.',
    type: Item, // 반환될 데이터 타입 (새로 등록된 비품)
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 요청 데이터입니다.', // BadRequestException
  })
  @ApiResponse({
    status: 404,
    description: '유저ID를 찾을 수 없거나 카테고리를 찾을 수 없습니다.', // NotFoundException
  })
  async createItem(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return await this.itemService.create(createItemDto); // 서비스에서 비품 등록 처리 후 새로 등록된 비품 반환
  }

  // 전체 비품 목록 조회
  @Get()
  @ApiOperation({
    summary: '전체 비품 목록 조회',
    description: '전체 비품 목록을 Redis 캐시를 통해 조회합니다.',
  })
  @ApiResponse({
    status: 200, // 요청이 성공적으로 처리된 경우 HTTP 200 응답
    description: '전체 비품 목록을 반환합니다.',
    type: [Item], // 반환될 데이터 타입 (비품 목록)
  })
  async getItems(): Promise<Item[]> {
    return this.itemCacheService.getCachedItem(); // 캐시에서 비품 목록 조회
  }

  // 쿼리 파라미터를 통해 특정 카테고리에 속한 비품만 필터링 조회
  @Get('category')
  @ApiOperation({
    summary: '특정 카테고리에 속한 비품 조회',
    description: '카테고리 ID를 통해 해당 카테고리의 비품만 조회합니다.',
  })
  @ApiResponse({
    status: 200, // 요청이 성공적으로 처리된 경우 HTTP 200 응답
    description: '특정 카테고리에 속한 비품 목록을 반환합니다.',
    type: [Item], // 반환될 데이터 타입 (특정 카테고리 비품 목록)
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 카테고리 ID입니다.', // BadRequestException
  })
  @ApiResponse({
    status: 404,
    description: '카테고리를 찾을 수 없습니다.', // NotFoundException
  })
  async getItemByCategory(
    @Query('categoryId', ParseIntPipe) categoryId: number, // URL 쿼리 파라미터에서 categoryId를 가져옴
  ): Promise<Item[]> {
    return this.itemService.findByCategory(categoryId); // 서비스에서 카테고리로 필터링된 비품 목록 조회
  }

  // 특정 유저가 등록한 비품 조회
  @Get('created-by/:userId')
  @ApiOperation({ summary: '특정 유저가 등록한 비품 조회' })
  @ApiResponse({
    status: 200,
    description: '특정 유저가 등록한 비품 목록 반환',
    type: [Item],
  })
  @ApiResponse({
    status: 404,
    description: '요청한 userId에 해당하는 사용자가 존재하지 않습니다.', // NotFoundException
  })
  async getItemsByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Item[]> {
    return this.itemService.findByUser(userId);
  }

  // 특정 비품 상세 정보 조회
  @Get(':id')
  @ApiOperation({
    summary: '특정 비품 상세 정보 조회',
    description: '특정 ID의 비품 상세 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200, // 요청이 성공적으로 처리된 경우 HTTP 200 응답
    description: '특정 비품 상세 정보',
    type: Item, // 반환될 데이터 타입 (특정 비품 정보)
  })
  @ApiResponse({
    status: 404,
    description: '비품을 찾을 수 없습니다.', // NotFoundException
  })
  async getItem(@Param('id', ParseIntPipe) id: number): Promise<Item> {
    return this.itemService.findOne(id); // 서비스에서 특정 비품 조회
  }

  // 특정 비품 정보 수정
  @Patch(':id')
  @ApiOperation({
    summary: '특정 비품 정보 수정',
    description: '특정 비품의 정보를 수정합니다.',
  })
  @ApiResponse({
    status: 200, // 요청이 성공적으로 처리된 경우 HTTP 200 응답
    description: '비품이 성공적으로 수정되었습니다.',
    type: Item, // 반환될 데이터 타입 (수정된 비품)
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 요청 데이터입니다.', // BadRequestException
  })
  @ApiResponse({
    status: 404,
    description: '비품을 찾을 수 없습니다.', // NotFoundException
  })
  async updateItem(
    @Param('id') id: number, // URL 경로에서 비품 ID를 가져옴
    @Body() updateItemDto: UpdateItemDto, // HTTP 요청 본문에서 수정할 비품 정보를 받음
  ): Promise<Item> {
    return await this.itemService.update(id, updateItemDto); // 서비스에서 비품 정보 수정 처리 후 반환
  }

  // 특정 비품 삭제
  @Delete(':id')
  @ApiOperation({
    summary: '비품 삭제',
    description: '특정 비품의 정보를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '비품이 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '비품을 찾을 수 없습니다.', // NotFoundException
  })
  async deleteItem(@Param('id') id: number): Promise<void> {
    await this.itemService.delete(id); // 서비스에서 비품 삭제 처리
  }
}
