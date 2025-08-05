import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({ example: '카테고리이름' })
  id: string;

  @ApiProperty({ example: '제품명' })
  name: string;
}
