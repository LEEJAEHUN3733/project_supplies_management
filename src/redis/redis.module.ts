import { Global, Module } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Global() // @Global() -> 애플리케이션 전체에 주입가능
@Module({
  // 현재 모듈은 외부모듈을 가져오지 않으므로 빈배열로 설정
  imports: [],

  // provider 설정
  providers: [
    {
      //Redis 클라이언트를 동적으로 생성하여 RedisService에 주입
      provide: RedisService.injection,
      useFactory: () => {
        // 'redis'라이브러리 불러오기.(TypeScript에서 require 사용 시 @ts-ignore로 경고 무시)
        //@ts-ignore
        const redis = require('redis');
        //redis 클라이언트 생성
        const client = redis.createClient();

        return client;
      },
    },
    // RedisService를 provider에 등록하여 다른곳에서 사용할 수 있도록 제공
    RedisService,
  ],

  // 모듈에서 제공하는 서비스를 외부 모듈에서도 사용할 수 있도록 exports에 추가
  exports: [RedisService.injection, RedisService],
})
export class RedisModule {}
