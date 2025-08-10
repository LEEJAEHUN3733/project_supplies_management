import { ApiProperty } from '@nestjs/swagger';
import { Item } from 'src/item/item.entity';
import { RentalHistory } from 'src/rental-history/rental-history.entity';

// 검색 결과로 반환될 비품 객체와 마지막 대여 이력을 정의하는 DTO
export class SearchResultDto extends Item {
  @ApiProperty({
    description: '마지막 대여 이력',
    required: false,
    nullable: true,
  })
  lastRentalHistory: RentalHistory | null;
}
