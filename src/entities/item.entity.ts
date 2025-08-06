import { ApiProperty } from '@nestjs/swagger';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

// 비품 상태를 나타내는 Enum
export enum ItemStatus {
  NORMAL = '정상',
  REPAIRING = '수리중',
  DISCARDED = '폐기',
}

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
  @ApiProperty({ example: ItemStatus.NORMAL, description: '비품 상태' })
  @Column({ type: 'enum', enum: ItemStatus, default: ItemStatus.NORMAL }) // 비품상태는 'enum'타입으로 ItemStatus에서 정의된 값 중 하나
  status: ItemStatus;

  // 비품 생성 날짜
  @ApiProperty({ example: '1997-05-22T12:00:00Z', description: '생성일' })
  @CreateDateColumn() // 비품이 생성될 때 자동으로 생성되는 날짜값
  createdAt: Date;

  // 비품이 속한 카테고리
  @ApiProperty({ description: '속한 카테고리' })
  @ManyToOne(() => Category, (category) => category.id, { eager: true })
  // 비품과 카테고리는 1:N 관계
  // 'eager: true'로 비품 조회 시 카테고리 정보를 자동으로 함께 로드
  category: Category;
}
