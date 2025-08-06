import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ItemStatus } from 'src/entities/item.entity';

export class UpdateItemDto {
  @ApiProperty({ example: '노트북', description: '비품명', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 10, description: '수량', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    example: ItemStatus.NORMAL,
    description: '비품 상태',
    required: false,
  })
  @IsEnum(ItemStatus)
  @IsOptional()
  status?: ItemStatus;

  @ApiProperty({ example: 1, description: '속한 카테고리 ID', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  categoryId?: number;
}
