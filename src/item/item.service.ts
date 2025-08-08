import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from 'src/item/dtos/create-item.dto';
import { UpdateItemDto } from 'src/item/dtos/update-item.dto';
import { Item, ItemStatus } from 'src/item/item.entity';
import { Repository } from 'typeorm';
import { ItemCacheService } from './item-cache.service';
import { Category } from 'src/category/category.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) // Item 엔티티에 대한 리포지토리 주입
    private itemRepository: Repository<Item>, // 비품 리포지토리

    @InjectRepository(Category) // Category 엔티티에 대한 리포지토리 주입
    private categoryRepository: Repository<Category>, // 카테고리 리포지토리
    private itemCacheService: ItemCacheService, // ItemCacheService 주입
  ) {}

  // 새 비품 등록
  async create(createItemDto: CreateItemDto): Promise<Item> {
    // 카테고리 조회
    const categoryCheck = await this.categoryRepository.findOne({
      where: { id: createItemDto.categoryId },
    });
    // 카테고리가 없을때 오류 처리
    if (!categoryCheck) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    // 비품 엔티티 생성 및 초기화
    const item = this.itemRepository.create({
      name: createItemDto.name,
      quantity: createItemDto.quantity,
      status: ItemStatus.NORMAL, // 비품의 초기상태 설정(NORMAL)
      categoryId: createItemDto.categoryId,
    });

    // 비품 저장
    return await this.itemRepository.save(item);
  }

  // 전체 비품 목록 조회
  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  // 특정 카테고리에 속한 비품만 필터링 조회
  async findByCategory(id: number): Promise<Item[]> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }
    return this.itemRepository.find({
      where: { categoryId: id }, // 카테고리 ID로 필터링
    });
  }

  // 특정 비품 상세 정보 조회
  async findOne(id: number): Promise<Item> {
    // 비품 아이디로 비품 조회
    const item = await this.itemRepository.findOne({
      where: { id },
    });
    // 비품이 없으면 오류 처리
    if (!item) {
      throw new NotFoundException('비품을 찾을 수 없습니다.');
    }
    return item;
  }

  // 특정 비품 정보 수정
  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    // 비품 조회
    const item = await this.itemRepository.findOne({ where: { id } });

    // 비품이 없으면 오류 처리
    if (!item) {
      throw new NotFoundException('비품을 찾을 수 없습니다.');
    }

    // 카테고리ID 변경 요청이 있을 경우 카테고리 존재 여부 확인
    if (updateItemDto.categoryId) {
      const categoryCheck = await this.categoryRepository.findOne({
        where: { id: updateItemDto.categoryId },
      });

      if (!categoryCheck) {
        throw new BadRequestException('유효하지 않은 카테고리 ID입니다.');
      }
    }

    // 비품 정보 수정 반영
    Object.assign(item, updateItemDto);
    // 수정된 비품 저장
    return await this.itemRepository.save(item);
  }

  // 특정 비품 삭제
  async delete(id: number): Promise<void> {
    // 비품 조회
    const item = await this.itemRepository.findOne({
      where: { id },
    });

    // 비품이 없으면 오류 처리
    if (!item) {
      throw new NotFoundException('비품을 찾을 수 없습니다.');
    }

    // 비품 삭제
    await this.itemRepository.remove(item);
  }
}
