import { ApiProperty } from '@nestjs/swagger';
import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
@Check(`"total_quantity" >=0`) // 비품의 총 수량은 0이상
@Check(`"current_quantity" >=0`) // 비품의 현재 수량은 0이상
@Check(`"total_quantity" >= "current_quantity"`) // 현재수량은 총 수량을 초과할 수 없음.
export class Item {
  // 비품 ID(Primary Key)
  @ApiProperty({ example: 1, description: '비품 ID' })
  @PrimaryGeneratedColumn() // 자동으로 생성되는 기본키를 설정
  id: number;

  // 비품명
  @ApiProperty({ example: '노트북', description: '비품명' })
  @Column() // 'name' 필드로 매핑
  name: string;

  // 비품의 총 보유 수량
  @ApiProperty({ example: 10, description: '총 보유 수량' })
  @Column('int', { name: 'total_quantity' }) // 'int'타입으로 매핑
  totalQuantity: number;

  // 비품의 현재 수량
  @ApiProperty({ example: 85, description: '현재 대여 가능한 수량' })
  @Column('int', { name: 'current_quantity' })
  currentQuantity: number;

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

  // 소프트 삭제
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
