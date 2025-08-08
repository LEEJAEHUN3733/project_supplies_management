import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from 'src/item/item.controller';
import { Item } from 'src/item/item.entity';
import { ItemService } from 'src/item/item.service';
import { ItemCacheService } from 'src/item/item-cache.service';
import { RedisModule } from '../redis/redis.module';
import { Category } from 'src/category/category.entity';

@Module({
  // 이 모듈에서 사용할 TypeORM 기능을 설정
  // TypeOrmModule.forFeature를 통해 Item과 Category 엔티티에 대한 repository 등록
  imports: [TypeOrmModule.forFeature([Item, Category]), RedisModule],
  // 모듈에서 사용할 컨트롤러 지정
  controllers: [ItemController],
  // 모듈에서 사용할 서비스 지정
  providers: [ItemService, ItemCacheService],
  // 외부 모듈에 ItemCacheService를 공유할 수 있도록 export
  exports: [ItemCacheService],
})
export class ItemModule {}
