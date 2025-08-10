import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalHistory } from './rental-history.entity';
import { RentalHistoryService } from './rental-history.service';
import { RentalHistoryController } from './rental-history.controller';
import { Item } from 'src/item/item.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RentalHistory, Item, User])],
  providers: [RentalHistoryService],
  controllers: [RentalHistoryController],
  exports: [RentalHistoryService],
})
export class RentalHistoryModule {}
