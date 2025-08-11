import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  // Redis 클라이언트를 주입받아 사용
  constructor(
    // 캐시용 클라이언트
    @Inject(RedisService.injection) private readonly client: any,
    // 발행자용 클라이언트
    @Inject(RedisService.publisherInjection) private readonly publisher: any,
    // 구독자용 클라이언트
    @Inject(RedisService.subscriberInjection) private readonly subscriber: any,
  ) {}

  // Redis 클라이언트 주입에 사용되는 고유 키
  static get injection() {
    return 'redis.legacy.injection' as const;
  }

  // 발행자(Publisher)를 위한 토큰
  static get publisherInjection() {
    return 'REDIS_PUBLISHER' as const;
  }

  // 구독자(Subscriber)를 위한 토큰
  static get subscriberInjection() {
    return 'REDIS_SUBSCRIBER' as const;
  }

  // Redis에서 특정 key의 값을 가져오는 메서드
  async get(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err: any, result: string | null) => {
        if (err)
          reject(err); // 에러 발생시 reject
        else resolve(result); // 정상적으로 값 반환
      });
    });
  }

  // Redis에 key와 value를 설정하고, TTL(유효기간)을 지정하는 메서드
  async set(key: string, value: string, ttlSeconds = 3600): Promise<void> {
    return new Promise((resolve, reject) => {
      // TTL을 적용하여 값을 설정
      this.client.set(key, value, 'EX', ttlSeconds, (err: any) => {
        if (err)
          reject(err); // 에러 발생 시 reject
        else resolve(); // 성공시 resolve
      });
    });
  }

  // Redis에서 특정 key를 삭제하는 메서드
  async del(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err: any) => {
        if (err)
          reject(err); // 에러 발생 시 reject
        else resolve(); // 성공 시 resolve
      });
    });
  }

  // Redis에서 특정 key가 존재하는지 확인하는 메서드
  async exists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.exists(key, (err: any, reply: number) => {
        if (err)
          reject(err); // 에러 발생 시 reject
        else resolve(reply === 1); // 존재하면 true, 아니면 false 반환
      });
    });
  }

  // Pub
  async publish(channel: string, message: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  }

  // Sub
  subscribe(channel: string, callback: (message: string) => void) {
    this.subscriber.subscribe(channel);
    this.subscriber.on(
      'message',
      (receivedChannel: string, message: string) => {
        if (receivedChannel === channel) {
          callback(message);
        }
      },
    );
  }
}
