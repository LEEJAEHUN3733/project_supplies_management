import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RentalHistory } from './rental-history.entity';
import { Item } from 'src/item/item.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class RentalHistoryService {
  constructor(
    // 트랜잭션 관리를 외해 DataSource 주입
    private readonly dataSource: DataSource,
    @InjectRepository(RentalHistory)
    private readonly rentalHistoryRepository: Repository<RentalHistory>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 비품 대여
  async rentItem(
    userId: number,
    itemId: number,
    quantity: number,
  ): Promise<RentalHistory> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 트랜잭션 내에서 queryRunner.manager를 통해 DB 작업 수행
      // 사용자 조회
      const user = await queryRunner.manager.findOneBy(User, { id: userId });
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      // 비품 조회
      const item = await queryRunner.manager.findOneBy(Item, { id: itemId });
      if (!item) {
        throw new NotFoundException('비품을 찾을 수 없습니다.');
      }

      // 재고 확인
      if (item.currentQuantity < quantity) {
        throw new BadRequestException(
          `재고가 부족합니다. (현재 재고: ${item.currentQuantity}개)`,
        );
      }

      // 빌렸을때 비품 재고 차감
      item.currentQuantity -= quantity;
      await queryRunner.manager.save(item);

      // 대여 기록 생성 (수량 포함)
      const newRental = queryRunner.manager.create(RentalHistory, {
        userId,
        itemId,
        quantity: quantity,
        rentalDate: new Date(),
        returnDate: null,
      });

      // 모든 작업 성공 시 저장 후 커밋
      await queryRunner.manager.save(newRental);
      await queryRunner.commitTransaction();

      return newRental;
    } catch (err) {
      await queryRunner.rollbackTransaction(); // 오류 발생 시 롤백
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 반납처리
  async returnItem(rentId: number): Promise<RentalHistory> {
    // 트랜잭션 처리를 위해 queryRunner 생성
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const rental = await queryRunner.manager.findOneBy(RentalHistory, {
        id: rentId,
      });
      if (!rental) {
        throw new NotFoundException('대여 기록을 찾을 수 없습니다.');
      }
      if (rental.returnDate) {
        throw new BadRequestException('이미 반납 처리되었습니다.');
      }

      // 반납할 비품 조회
      const item = await queryRunner.manager.findOneBy(Item, {
        id: rental.itemId,
      });

      if (!item) {
        throw new NotFoundException('반납하려는 비품을 찾을 수 없습니다.');
      }

      // 반납할 수량만큼 현재 재고를 다시 늘린다.
      item.currentQuantity += rental.quantity;
      await queryRunner.manager.save(item);

      // 대여 기록에 반납 날짜 기록
      rental.returnDate = new Date();

      // 저장 후 트랜잭션 커밋
      await queryRunner.manager.save(rental);
      await queryRunner.commitTransaction();

      return rental;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
