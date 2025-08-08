import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ItemStatus, ItemStatusType } from 'src/item/item.entity';

const allowedItemStatus = Object.values(ItemStatus);

// 비품 수정 시 필요한 데이터 구조를 나타내는 DTO 클래스
export class UpdateItemDto {
  @ApiProperty({ example: '노트북', description: '비품명', required: false })
  @IsString({ message: '비품명은 문자열이어야 합니다.' }) // 'name' 값이 문자열인지 검사
  @IsOptional() // 'name' 값은 선택사항
  name?: string;

  @ApiProperty({ example: 10, description: '수량', required: false })
  @IsInt({ message: '수량은 정수여야 합니다.' }) // 'quantity' 값이 정수인지 검사
  @Min(0, { message: '수량은 0 이상이어야 합니다.' }) // 'quantity' 값이 0 이상인지 검사
  @IsOptional() // 'quantity' 값은 선택사항
  @Type(() => Number)
  quantity?: number;

  @ApiProperty({
    example: ItemStatus.NORMAL,
    description: '비품 상태',
    required: false, // 비품 상태는 선택사항
  })
  @IsIn(allowedItemStatus, {
    message: `상태는 ${allowedItemStatus.join(', ')} 중 하나여야 합니다.`,
  }) // 비품 상태가 ItemStatus로 정의된 값 중 하나인지 검사
  @IsOptional() // 비품 상태는 선택사항
  status?: ItemStatusType;

  @ApiProperty({ example: 1, description: '속한 카테고리 ID', required: false })
  @IsInt({ message: '카테고리 ID는 정수여야 합니다.' }) // 'categoryId' 값이 숫자인지 검사
  @Min(1, { message: '카테고리 ID는 1 이상이어야 합니다.' }) // 'categoryId' 값이 1 이상인지 검사
  @IsOptional() // 'categoryId' 값은 선택사항
  @Type(() => Number)
  categoryId?: number;
}
