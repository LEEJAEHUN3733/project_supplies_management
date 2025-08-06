import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from './redis.service';
import { Item } from 'src/entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemCacheService {
  // 캐시 키와 만료시간 설정
  private readonly cacheKey = 'items_cached';
  private readonly cacheExpiration = 3600; // 1시간

  constructor(
    @InjectRepository(Item) // Item 엔티티의 리포지토리 주입
    private itemRepository: Repository<Item>, // 비품에 대한 CRUD 작업을 처리하는 리포지토리
    private readonly redisService: RedisService, // RedisService를 주입하여 Redis와 상호작용
  ) {}

  // 비품 목록 캐시 갱신(비품 추가, 삭제, 갱신 후 캐시 갱신)
  async refreshCache(): Promise<void> {
    // 데이터베이스에서 비품목록 조회
    const items = await this.itemRepository.find();
    // Redis에 비품 목록 캐싱
    await this.redisService.set(
      this.cacheKey, // 캐시 키
      JSON.stringify(items), // 비품목록을 JSON 문자열로 변환
      this.cacheExpiration, // 캐시 만료 기간
    );
  }

  // 캐시된 비품 목록 조회
  async getCachedItem(): Promise<Item[]> {
    try {
      // Redis에서 캐시된 비품 목록을 조회
      const cachedItems = await this.redisService.get(this.cacheKey);

      if (cachedItems) {
        // 캐시가 있다면 데이터 반환
        // 캐시된 데이터를 JSON으로 파싱하여 반환
        return JSON.parse(cachedItems);
      }

      // 캐시가 없다면 데이터베이스에서 비품 목록 조회
      const items = await this.itemRepository.find();

      // Redis에 비품 목록 캐싱
      await this.redisService.set(
        this.cacheKey,
        JSON.stringify(items),
        this.cacheExpiration,
      );

      return items;
    } catch (error) {
      // DB나 Redis에서 오류가 발생했을 때 오류처리
      console.error('DB나 Redis에서 오류가 발생했습니다', error);
      throw new Error('데이터 조회 중 문제가 발생했습니다.');
    }
  }
}
