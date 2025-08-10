import { ApiProperty } from '@nestjs/swagger';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 비품 상태를 나타내는 상수 객체
export const ItemStatus = {
  NORMAL: '정상',
  REPAIRING: '수리중',
  DISCARDED: '폐기',
} as const;

export type ItemStatusType = (typeof ItemStatus)[keyof typeof ItemStatus];

@Entity() // TypeORM 엔티티로 지정
@Check(`"quantity" >=0`) // 비품의 수량은 0이상
export class Item {
  // 비품 ID(Primary Key)
  @ApiProperty({ example: 1, description: '비품 ID' })
  @PrimaryGeneratedColumn() // 자동으로 생성되는 기본키를 설정
  id: number;

  // 비품명
  @ApiProperty({ example: '노트북', description: '비품명' })
  @Column() // 'name' 필드로 매핑
  name: string;

  // 비품의 수량
  @ApiProperty({ example: 10, description: '수량' })
  @Column('int') // 'int'타입으로 매핑
  quantity: number;

  // 비품 상태
  @ApiProperty({ example: '정상', description: '비품 상태' })
  @Column({ type: 'varchar', default: ItemStatus.NORMAL })
  status: ItemStatusType;

  // 카테고리 ID
  @ApiProperty({ example: 1, description: '전자제품' })
  @Column('int', { name: 'category_id' })
  categoryId: number;

  // 비품 생성 날짜
  @ApiProperty({ example: '1997-05-22T12:00:00Z', description: '생성일' })
  @CreateDateColumn({ name: 'created_at' }) // 비품이 생성될 때 자동으로 생성되는 날짜값
  createdAt: Date;

  // 비품을 등록한 사용자 ID
  @ApiProperty({ example: 3, description: '비품을 등록한 사용자 ID' })
  @Column('int', { name: 'created_by_user_id' }) // 'created_by_user_id'로 매핑
  createdByUserId: number;
}
