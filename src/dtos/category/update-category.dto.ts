import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: '전자제품', description: '갱신할 카테고리 이름' })
  @IsString()
  name: string; // 카테고리 이름
}
