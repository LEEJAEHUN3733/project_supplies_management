import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/category/create-category.dto';
import { UpdateCategoryDto } from '../dtos/category/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    // Category 엔티티에 대한 리포지토리를 주입받음
    @InjectRepository(Category) // Category 엔티티를 위한 리포지토리 인스턴스를 주입
    private categoryRepository: Repository<Category>, // Category에 대한 CRUD 작업을 처리하는 리포지토리
  ) {}

  // 카테고리 등록
  async createCategory(
    createCategoryDto: CreateCategoryDto, // 카테고리 생성에 필요한 데이터
  ): Promise<Category> {
    // DTO를 기반으로 카테고리 엔티티를 생성
    const category = this.categoryRepository.create(createCategoryDto);
    // 카테고리 엔티티를 DB에 저장하고 반환
    return this.categoryRepository.save(category);
  }

  // 카테고리 목록 조회
  async getCategories(): Promise<Category[]> {
    // 카테고리 엔티티를 ID 기준으로 오름차순으로 조회하여 반환
    return this.categoryRepository.find({ order: { id: 'ASC' } });
  }

  // 카테고리 갱신
  async updateCategory(
    id: number, // 갱신할 카테고리의 ID
    updateCategoryDto: UpdateCategoryDto, // 카테고리 갱신에 필요한 데이터
  ): Promise<Category> {
    // 카테고리를 ID로 조회
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new Error('카테고리를 찾을 수 없습니다.');
    }

    // 카테고리 이름 갱신
    category.name = updateCategoryDto.name;

    // 변경된 카테고리 데이터를 DB에 저장하고 반환
    return this.categoryRepository.save(category);
  }

  // 카테고리 삭제
  async deleteCategory(id: number): Promise<void> {
    // 삭제할 카테고리를 ID로 조회
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new Error('카테고리를 찾을 수 없습니다.');
    }

    // 카테고리를 DB에서 삭제
    await this.categoryRepository.remove(category);
  }
}
