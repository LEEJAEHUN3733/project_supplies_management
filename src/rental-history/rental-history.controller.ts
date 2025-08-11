import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RentalHistoryService } from './rental-history.service';
import { RentalHistory } from './rental-history.entity';
import { RentalHistoryItemDto } from './rental-history.dto';

@ApiTags('대여/반납 이력 관리 API') // Swagger 문서에서 해당 API 그룹 명시
@Controller('rental-history')
export class RentalHistoryController {
  constructor(private readonly rentalHistoryService: RentalHistoryService) {}

  // 비품 대여
  @Post('rent/:userId/:itemId')
  @ApiOperation({ summary: '비품 대여' })
  @ApiBody({ type: RentalHistoryItemDto })
  @ApiResponse({
    status: 201,
    description: '대여 기록 생성',
    type: RentalHistory,
  })
  @ApiResponse({
    status: 400,
    description: '이미 대여 중인 비품입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '사용자 또는 비품을 찾을 수 없습니다.',
  })
  async rentItem(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() rentalHistoryItemDto: RentalHistoryItemDto,
  ): Promise<RentalHistory> {
    return this.rentalHistoryService.rentItem(
      userId,
      itemId,
      rentalHistoryItemDto.quantity,
    );
  }

  // 반납 처리
  @Patch('return/:rentId')
  @ApiOperation({ summary: '비품 반납' })
  @ApiResponse({
    status: 200,
    description: '반납 처리 완료',
    type: RentalHistory,
  })
  @ApiResponse({
    status: 400,
    description: '이미 반납 처리된 비품입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '대여 기록을 찾을 수 없습니다.',
  })
  async returnItem(
    @Param('rentId', ParseIntPipe) rentId: number,
  ): Promise<RentalHistory> {
    return this.rentalHistoryService.returnItem(rentId);
  }

  // 전체 대여/반납 이력 조회
  @Get()
  @ApiOperation({ summary: '전체 대여/반납 이력 조회' })
  @ApiResponse({
    status: 200,
    description: '전체 대여 및 반납 이력 목록',
    type: [RentalHistory],
  })
  async findAll(): Promise<RentalHistory[]> {
    return this.rentalHistoryService.findAll();
  }

  // 특정 비품의 전체 대여/반납 이력 조회
  @Get('item/:itemId')
  @ApiOperation({ summary: '특정 비품의 대여/반납 이력 조회' })
  @ApiResponse({
    status: 200,
    description: '대여 이력 조회',
    type: [RentalHistory],
  })
  @ApiResponse({
    status: 404,
    description: '비품을 찾을 수 없습니다.',
  })
  async getRentalHistoryByItem(
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<RentalHistory[]> {
    return this.rentalHistoryService.findByItem(itemId);
  }

  // 특정 유저의 전체 대여/반납 이력 조회
  @Get('users/:userId')
  @ApiOperation({ summary: '특정 유저의 대여/반납 이력 조회' })
  @ApiResponse({
    status: 200,
    description: '해당 유저의 대여 및 반납 이력 목록',
    type: [RentalHistory],
  })
  @ApiResponse({
    status: 404,
    description: '해당 사용자의 대여 기록이 존재하지 않습니다.',
  })
  async getUserRentalHistory(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<RentalHistory[]> {
    return this.rentalHistoryService.findByUser(userId);
  }
}
