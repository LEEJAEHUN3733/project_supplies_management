import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ItemStatus } from 'src/entities/item.entity';

// 비품 생성 시 필요한 데이터 구조를 나타내는 DTO 클래스
export class CreateItemDto {
  @ApiProperty({ example: '노트북', description: '비품명' })
  @IsString() // 'name'값이 문자열인지 검사
  @IsNotEmpty() // 'name' 값이 비어있지 않은지 검사
  name: string;

  @ApiProperty({ example: 10, description: '수량' })
  @IsNumber() // 'quantity'값이 숫자인지 검사
  @Min(0) // 'quantity'값이 0이상인지 검사
  quantity: number;

  @ApiProperty({
    example: ItemStatus.NORMAL,
    description: '비품 상태',
    required: false, // 비품 상태는 선택사항
  })
  @IsEnum(ItemStatus) // 비품 상태가 ItemStatus enum에 정의된 값 중 하나인지 검사
  @IsOptional() // 비품상태는 선택사항
  status?: ItemStatus;

  @ApiProperty({ example: 1, description: '속한 카테고리 ID' })
  @IsNumber() // 'categoryId'값이 숫자인지 검사
  @Min(0) // 'categoryId'값이 0이상인지 검사
  categoryId: number;
}
