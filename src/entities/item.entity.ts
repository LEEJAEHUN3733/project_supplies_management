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

export enum ItemStatus {
  NORMAL = '정상',
  REPAIRING = '수리중',
  DISCARDED = '폐기',
}

@Entity()
@Check(`"quantity" >=0`)
export class Item {
  @ApiProperty({ example: 1, description: '비품 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '노트북', description: '비품명' })
  @Column()
  name: string;

  @ApiProperty({ example: 10, description: '수량' })
  @Column('int')
  quantity: number;

  @ApiProperty({ example: ItemStatus.NORMAL, description: '비품 상태' })
  @Column({ type: 'enum', enum: ItemStatus, default: ItemStatus.NORMAL })
  status: ItemStatus;

  @ApiProperty({ example: '1997-05-22T12:00:00Z', description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '속한 카테고리' })
  @ManyToOne(() => Category, (category) => category.id, { eager: true })
  category: Category;
}
