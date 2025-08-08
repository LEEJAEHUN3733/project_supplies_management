import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AppService {
  // RedisService 의존성으로 주입받음
  constructor(protected readonly redisService: RedisService) {}
  // 'getHello' 메서드는 Redis에 값을 저장하고 이를 조회하여 결과 반환
  async getHello(): Promise<string> {
    // '1'이라는 키로 'Hello World!'라는 값을 Redis에 1초 동안 저장
    await this.redisService.set('1', 'Hello World!', 5);
    // 3초 대기 후, Redis에서 '1' 키에 해당하는 값을 가져옴.
    await this.wait(3000);
    // Redis에서 가져온 값이 있으면 반환하고, 없으면 'Null'을 반환.
    const result = await this.redisService.get('1');
    return result ? result : 'Null';
  }
  // 주어진 밀리초만큼 대기하는 함수
  wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
