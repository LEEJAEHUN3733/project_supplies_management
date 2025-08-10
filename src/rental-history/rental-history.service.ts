import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalHistory } from './rental-history.entity';
import { Item } from 'src/item/item.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class RentalHistoryService {
  constructor(
    @InjectRepository(RentalHistory)
    private readonly rentalHistoryRepository: Repository<RentalHistory>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 비품 대여
  async rentItem(userId: number, itemId: number): Promise<RentalHistory> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    // 사용자 존재 여부 확인
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 비품 존재 여부 확인
    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException('비품을 찾을 수 없습니다.');
    }
    const existing = await this.rentalHistoryRepository.findOne({
      where: { userId, itemId, returnDate: null },
    });

    // 비품이 현재 대여 중인지 확인
    if (existing) {
      throw new BadRequestException('이미 대여 중인 비품입니다.');
    }

    // 새로운 대여 기록 생성 및 저장
    const newRental = this.rentalHistoryRepository.create({
      userId,
      itemId,
      rentalDate: new Date(),
      returnDate: null,
    });

    return this.rentalHistoryRepository.save(newRental);
  }

  // 반납처리
  async returnItem(rentId: number): Promise<RentalHistory> {
    const rental = await this.rentalHistoryRepository.findOne({
      where: { id: rentId },
    });
    // 대여 기록 확인
    if (!rental) {
      throw new NotFoundException('대여 기록을 찾을 수 없습니다.');
    }
    // 반납 기록 확인
    if (rental.returnDate) {
      throw new BadRequestException('이미 반납 처리되었습니다.');
    }

    rental.returnDate = new Date();

    return this.rentalHistoryRepository.save(rental);
  }

  // 전체 대여 이력 조회
  async findAll(): Promise<RentalHistory[]> {
    return this.rentalHistoryRepository.find({
      order: { rentalDate: 'DESC' },
    });
  }

  // 특정 비품의 모든 대여/반납 이력 조회
  async findByItem(itemId: number): Promise<RentalHistory[]> {
    return this.rentalHistoryRepository.find({
      where: { itemId },
      order: { rentalDate: 'DESC' },
    });
  }

  // 특정 사용자 대여/반납 이력 조회
  async findByUser(userId: number): Promise<RentalHistory[]> {
    const userRentals = await this.rentalHistoryRepository.find({
      where: { userId },
      order: { rentalDate: 'DESC' },
    });

    if (!userRentals || userRentals.length === 0) {
      throw new NotFoundException('해당 사용자의 대여 기록이 없습니다.');
    }

    return userRentals;
  }
}
