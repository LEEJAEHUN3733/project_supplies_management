import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  // 모든 비품 조회
  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  // 새 비품 등록
  async create(item: Item): Promise<Item> {
    return this.itemRepository.save(item);
  }
}
