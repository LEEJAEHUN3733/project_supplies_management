import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from 'src/controllers/category.controller';
import { Category } from 'src/entities/category.entity';
import { CategoryService } from 'src/services/category.service';

@Module({
  // 모듈에서 사용할 TypeORM 기능 설정
  // TypeOrmModule.forFeature를 통해 Category 엔티티에 대한 repository 등록
  imports: [TypeOrmModule.forFeature([Category])],
  // 모듈에서 사용할 컨트롤러 지정
  controllers: [CategoryController],
  // 모듈에서 사용할 서비스 지정
  providers: [CategoryService],
})
export class CategoryModule {}
