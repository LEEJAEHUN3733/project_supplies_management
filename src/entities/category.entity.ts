import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @ApiProperty({ example: 1, description: '카테고리 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '전자제품', description: '카테고리 이름' })
  @Column()
  name: string;
}
