import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: '사용자 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '홍길동', description: '사용자 이름' })
  @Column()
  name: string;
}
