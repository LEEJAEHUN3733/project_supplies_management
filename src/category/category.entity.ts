import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // TypeORM 엔티티로 지정
export class Category {
  // 카테고리 ID(Primary Key)
  @ApiProperty({ example: 1, description: '카테고리 ID' })
  @PrimaryGeneratedColumn() // 자동으로 생성되는 기본키를 설정
  id: number;

  // 카테고리 이름
  @ApiProperty({ example: '전자제품', description: '카테고리 이름' })
  @Column() // 'name' 필드로 매핑
  name: string;
}
