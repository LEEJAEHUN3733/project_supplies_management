import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';
import { ItemController } from 'src/controllers/item.controller';
import { Item } from 'src/entities/item.entity';
import { ItemService } from 'src/services/item.service';
import { ItemCacheService } from 'src/services/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    RedisModule.register({
      host: 'localhost',
      port: 6379,
      db: 0,
    }),
  ],
  controllers: [ItemController],
  providers: [ItemService, ItemCacheService],
  exports: [ItemCacheService],
})
export class ItemModule {}
