import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'nestjs-redis';
import { Item } from 'src/entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemCacheService {
  private readonly cacheKey = 'items_cached';
  private readonly cacheExpiration = 3600;

  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    private readonly redisService: RedisService,
  ) {}

  // Redis 클라이언트 가져오기
  private get redis() {
    return this.redisService.getClient();
  }

  // 캐시된 데이터 확인
  async getCachedItems(): Promise<Item[]> {
    try {
      const cachedItems = await this.redis.get(this.cacheKey);

      // 캐시가 존재하면 캐시된 데이터 반환
      if (cachedItems) {
        return JSON.parse(cachedItems); // 캐시된 데이터 반환
      }

      // 캐시가 없다면 DB에서 가져오고 캐시 저장
      const items = await this.itemRepository.find();

      // 캐시에 데이터 저장(1시간)
      await this.redis.set(
        this.cacheKey,
        JSON.stringify(items),
        'EX',
        this.cacheExpiration,
      );
      return items;
    } catch (error) {
      // Redis나 DB오류 처리
      console.error('DB나 Redis에서 오류가 발생했습니다', error);
      throw new Error('데이터 조회 중 문제가 발생했습니다.');
    }
  }
}
