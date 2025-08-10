import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/item/item.entity';
import { RentalHistory } from 'src/rental-history/rental-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(RentalHistory)
    private readonly rentalHistoryRepository: Repository<RentalHistory>,
  ) {}

  async searchItems(name: string, page: number): Promise<Item[]> {
    const pageSize = 5; // 한 페이지에 5개만 조회

    // 검색 조건에 맞는 비품(Item)들을 먼저 조회
    const items = await this.itemRepository
      .createQueryBuilder('item')
      .where('item.name ILIKE :name', { name: `%${name}%` })
      .orderBy('item.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    // 조회된 각 비품에 대해 마지막 대여 이력 찾기
    const itemsWithHistory = await Promise.all(
      items.map(async (item) => {
        const lastRentalHistory = await this.rentalHistoryRepository
          .createQueryBuilder('rental')
          .where('rental.itemId = :itemId', { itemId: item.id })
          .orderBy('rental.rentalDate', 'DESC')
          .limit(1)
          .getOne();

        return {
          ...item,
          lastRentalHistory: lastRentalHistory || null, // 이력이 없으면 null을 반환
        };
      }),
    );

    return itemsWithHistory as Item[];
  }
}
