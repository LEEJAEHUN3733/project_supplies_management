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

@Module({
  imports: [
    // TypeORM 모듈을 통해 데이터베이스 연결 설정
    TypeOrmModule.forRoot({
      type: 'postgres', // PostgreSQL 사용
      host: 'localhost', // 데이터베이스 호스트 주소
      port: 5432, // 데이터베이스 포트 번호
      username: 'postgres', // 데이터베이스 사용자 이름
      password: '0522', // 데이터베이스 비밀번호
      database: 'supplies_management', // 데이터베이스 이름
      entities: [Item, Category, User, RentalHistory], // 데이터베이스에서 사용될 엔티티
      synchronize: true, // 애플리케이션 실행시 스키마 자동 동기화 설정
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
