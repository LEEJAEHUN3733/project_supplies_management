import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/category.entity';
import { CategoryModule } from '../category/category.module';
import { AppController } from 'src/app/app.controller';
import { AppService } from 'src/app/app.service';
import { ItemModule } from '../item/item.module';
import { RedisModule } from '../redis/redis.module';
import { Item } from 'src/item/item.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
import { RentalHistory } from 'src/rental-history/rental-history.entity';
import { RentalHistoryModule } from 'src/rental-history/rental-history.module';
import { SearchModule } from 'src/search/search.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // ConfigModule을 임포트하고 전역으로 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeORM 모듈을 통해 데이터베이스 연결 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // PostgreSQL 사용
        host: configService.get<string>('DB_HOST'), // 데이터베이스 호스트 주소
        port: configService.get<number>('DB_PORT'), // 데이터베이스 포트 번호
        username: configService.get<string>('DB_USERNAME'), // 데이터베이스 사용자 이름
        password: configService.get<string>('DB_PASSWORD'), // 데이터베이스 비밀번호
        database: configService.get<string>('DB_DATABASE'), // 데이터베이스 이름
        entities: [Item, Category, User, RentalHistory], // 데이터베이스에서 사용될 엔티티
        synchronize: false, // 애플리케이션 실행시 스키마 자동 동기화 설정
      }),
    }),
    CategoryModule,
    RedisModule,
    ItemModule,
    UserModule,
    RentalHistoryModule,
    SearchModule,
  ],
  // 모듈에서 사용할 컨트롤러 지정
  controllers: [AppController],
  // 모듈에서 제공하는 서비스 지정
  providers: [AppService],
})
export class AppModule {}
