import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class RentalHistoryItemDto {
  @ApiProperty({
    description: '대여할 비품의 수량',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: '수량은 정수여야 합니다.' })
  @Min(1, { message: '수량은 최소 1 이상이어야 합니다.' })
  quantity: number;
}
