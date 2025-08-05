import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '0522',
      database: 'category',
      entities: [Category],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
