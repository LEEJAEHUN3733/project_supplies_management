import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/item/item.entity';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { RentalHistory } from 'src/rental-history/rental-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, RentalHistory])],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [SearchService],
})
export class SearchModule {}
