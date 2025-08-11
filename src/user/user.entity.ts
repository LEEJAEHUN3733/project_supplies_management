import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: '사용자 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '홍길동', description: '사용자 이름' })
  @Column()
  name: string;

  // 회원탈퇴, 유저정보 삭제 시 기록
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
