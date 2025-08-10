import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RentalHistory {
  @ApiProperty({ example: 1, description: '대여 기록 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 2, description: '대여자(사용자) ID' })
  @Column('int', { name: 'user_id' })
  userId: number;

  @ApiProperty({ example: 3, description: '대여한 비품 ID' })
  @Column('int', { name: 'item_id' })
  itemId: number;

  @ApiProperty({ example: '1997-05-22T12:34:56Z', description: '대여날짜' })
  @Column({ name: 'rental_date' })
  rentalDate: Date;

  @ApiProperty({
    example: '1997-05-22T12:34:56Z',
    description: '반납날짜 (null일시 아직 대여중인상태)',
  })
  @Column('timestamp', { name: 'return_date', nullable: true })
  returnDate: Date | null;
}
