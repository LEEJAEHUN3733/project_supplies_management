import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('사용자 관리 API') // Swagger API 명세서에서 사용자 관리 API로 그룹화
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 유저 등록
  @Post()
  @ApiOperation({
    summary: '새 사용자 등록',
    description: '새로운 사용자를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자가 성공적으로 등록되었습니다.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 요청 데이터입니다.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // 전체 사용자 조회
  @Get()
  @ApiOperation({
    summary: '전체 사용자 조회',
    description: '등록된 모든 사용자의 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '사용자 목록 반환', type: [User] })
  async findUsers(): Promise<User[]> {
    return this.userService.findUsers();
  }

  // 특정 사용자 조회
  @Get(':id')
  @ApiOperation({
    summary: '특정 사용자 조회',
    description: 'ID를 통해 특정 사용자의 정보를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '사용자 반환', type: User })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findUser(id);
  }

  // 사용자 정보 갱신
  @Patch(':id')
  @ApiOperation({
    summary: '사용자 정보 갱신',
    description: '특정 사용자의 정보를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보가 수정되었습니다.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 요청 데이터입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, UpdateUserDto);
  }

  // 사용자 삭제
  @Delete(':id')
  @ApiOperation({
    summary: '사용자 삭제',
    description: 'ID를 통해 특정 사용자를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
