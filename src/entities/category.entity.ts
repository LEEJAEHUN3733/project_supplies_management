import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Item } from './item.entity';

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

  // 카테고리와 관련된 비품 목록(itemService에서 사용)
  @OneToMany(() => Item, (item) => item.category) // 카테고리와 Item은 1:N 관계
  items: Item[]; // 해당 카테고리에 속하는 비품 목록
}
