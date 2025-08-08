import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// 카테고리 생성 시 필요한 데이터 구조를 나타내는 DTO 클래스
export class CreateCategoryDto {
  @ApiProperty({ example: '전자제품', description: '카테고리 이름' }) // Swagger 문서화 시 '카테고리 이름'의 예시 값과 설명을 추가
  @IsString({ message: '카테고리명은 문자열이어야 합니다.' }) // 'name' 값이 문자열인지 검사
  @IsNotEmpty({ message: '카테고리명은 비워둘 수 없습니다.' }) // 'name' 값이 비어있지 않은지 검사
  name: string; // 카테고리 이름
}
