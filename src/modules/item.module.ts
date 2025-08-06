import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from 'src/controllers/item.controller';
import { Item } from 'src/entities/item.entity';
import { ItemService } from 'src/services/item.service';
import { ItemCacheService } from 'src/services/item-cache.service';
import { RedisModule } from './redis.module';
import { Category } from 'src/entities/category.entity';

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
