import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: '전자제품', description: '카테고리 이름' })
  @IsString()
  @IsNotEmpty()
  name: string; // 카테고리 이름
}
