import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ItemStatus } from 'src/entities/item.entity';

export class CreateItemDto {
  @ApiProperty({ example: '노트북', description: '비품명' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 10, description: '수량' })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    example: ItemStatus.NORMAL,
    description: '비품 상태',
    required: false,
  })
  @IsEnum(ItemStatus)
  @IsOptional()
  status?: ItemStatus;

  @ApiProperty({ example: 1, description: '속한 카테고리 ID' })
  @IsNumber()
  @Min(0)
  categoryId: number;
}
