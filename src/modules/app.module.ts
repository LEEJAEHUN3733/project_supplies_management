import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { CategoryModule } from './category.module';
import { AppController } from 'src/controllers/app.controller';
import { AppService } from 'src/services/app.service';
import { RedisModule } from 'nestjs-redis';
import { ItemModule } from './item.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '0522',
      database: 'supplies_management',
      entities: [Category],
      synchronize: true,
    }),
    CategoryModule,

    // Redis모듈 설정
    RedisModule.register({
      host: 'localhost',
      port: 6379,
      db: 0,
    }),
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
