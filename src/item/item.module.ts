import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from 'src/item/item.controller';
import { Item } from 'src/item/item.entity';
import { ItemService } from 'src/item/item.service';
import { ItemCacheService } from 'src/item/item-cache.service';
import { RedisModule } from '../redis/redis.module';
import { Category } from 'src/category/category.entity';
import { User } from 'src/user/user.entity';
import { RedisService } from 'src/redis/redis.service';

@Module({
  // 이 모듈에서 사용할 TypeORM 기능을 설정
  // TypeOrmModule.forFeature를 통해 Item과 Category, User 엔티티에 대한 repository 등록
  imports: [TypeOrmModule.forFeature([Item, Category, User]), RedisModule],
  // 모듈에서 사용할 컨트롤러 지정
  controllers: [ItemController],
  // 모듈에서 사용할 서비스 지정
  providers: [ItemService, ItemCacheService, RedisService],
  // 외부 모듈에 ItemCacheService를 공유할 수 있도록 export
  exports: [ItemCacheService, ItemService],
})
export class ItemModule implements OnModuleInit {
  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    // RedisService의 subscribe 메서드를 사용해 'item_created' 채널을 구독
    this.redisService.subscribe('item_created', (message) => {
      try {
        const payload = JSON.parse(message);
        console.log(
          `관리자에게 알림 발송 : [${payload.name}]이 등록되었습니다."`,
        );
      } catch (e) {
        console.log('메시지 파싱 오류:', e);
      }
    });
    console.log('Redis 리스너가 채널을 구독하기 시작했습니다.');
  }
}
