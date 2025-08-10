import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ItemStatus, ItemStatusType } from '../item.entity';
import { Type } from 'class-transformer';

const allowedItemStatus = Object.values(ItemStatus);

// 비품 생성 시 필요한 데이터 구조를 나타내는 DTO 클래스
export class CreateItemDto {
  @ApiProperty({ example: '노트북', description: '비품명' })
  @IsString({ message: '비품명은 문자열이어야 합니다.' }) // 'name'값이 문자열인지 검사
  @IsNotEmpty({ message: '비품명은 비워둘 수 없습니다.' }) // 'name' 값이 비어있지 않은지 검사
  name: string;

  @ApiProperty({ example: 10, description: '수량' })
  @IsInt({ message: '수량은 정수여야 합니다.' }) // 'quantity'값이 정수인지 검사
  @Min(0, { message: '수량은 0 이상이어야 합니다.' }) // 'quantity'값이 0이상인지 검사
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    example: ItemStatus.NORMAL,
    description: '비품 상태',
    required: false, // 비품 상태는 선택사항
  })
  @IsIn(allowedItemStatus, {
    message: `상태는 ${allowedItemStatus.join(', ')} 중 하나여야 합니다.`,
  }) // 비품 상태가 ItemStatus로 정의된 값 중 하나인지 검사
  @IsOptional() // 비품상태는 선택사항
  status?: ItemStatusType;

  @ApiProperty({ example: 1, description: '속한 카테고리 ID' })
  @IsInt({ message: '카테고리 ID는 정수여야 합니다.' }) // 'categoryId'값이 숫자인지 검사
  @Min(1, { message: '카테고리 ID는 1 이상이어야 합니다.' }) // 'categoryId'값이 1이상인지 검사
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ example: 3, description: '비품 등록한 사용자 ID' })
  @IsInt({ message: '사용자 ID는 정수여야 합니다.' }) // 'userId' 값이 숫자인지 검사
  @Min(1, { message: '사용자 ID는 1 이상이어야 합니다.' }) // 'userId' 값이 1이상인지 검사
  @Type(() => Number)
  createdByUserId: number;
}
