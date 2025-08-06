import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// 카테고리 수정 시 필요한 데이터 구조를 나타내는 DTO 클래스
export class UpdateCategoryDto {
  @ApiProperty({ example: '전자제품', description: '갱신할 카테고리 이름' })
  @IsString() // 'name' 값이 문자열인지 검사
  @IsNotEmpty() // 'name' 값이 비어있지 않은지 검사
  name: string; // 카테고리 이름
}
