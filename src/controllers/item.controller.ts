import { Controller, Get } from '@nestjs/common';
import { Item } from 'src/entities/item.entity';
import { ItemService } from 'src/services/item.service';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  // 비품 목록 가져오기
  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }
}
