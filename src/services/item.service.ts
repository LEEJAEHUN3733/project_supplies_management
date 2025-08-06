import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from 'src/dtos/item/create-item.dto';
import { UpdateItemDto } from 'src/dtos/item/update-item.dto';
import { Item, ItemStatus } from 'src/entities/item.entity';
import { Repository } from 'typeorm';
import { ItemCacheService } from './item-cache.service';
import { Category } from 'src/entities/category.entity';

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
    const category = await this.categoryRepository.findOneBy({
      id: createItemDto.categoryId,
    });

    // 카테고리가 없을때 오류 처리
    if (!category) {
      throw new Error('카테고리를 찾을 수 없습니다.');
    }

    // 비품 엔티티 생성 및 초기화
    const item = this.itemRepository.create({
      name: createItemDto.name,
      quantity: createItemDto.quantity,
      status: ItemStatus.NORMAL, // 비품의 초기상태 설정(NORMAL)
      category, // 생성된 카테고리와 연결
    });

    // 비품 저장
    const savedItem = await this.itemRepository.save(item);

    // 캐시 갱신
    await this.itemCacheService.refreshCache();

    return savedItem;
  }

  // 전체 비품 목록 조회
  async findAll(): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item') // QueryBuilder를 사용하여 비품 조회
      .leftJoinAndSelect('item.category', 'category') // 카테고리와 JOIN
      .getMany(); // 결과 반환
  }

  // 쿼리 파라미터를 통해 특정 카테고리에 속한 비품만 필터링 조회
  async findByCategory(id: number): Promise<Item[]> {
    return this.itemRepository.find({
      where: { category: { id } }, // 카테고리 ID로 필터링
      relations: ['category'], // 카테고리 정보를 포함하여 조회
    });
  }

  // 특정 비품 상세 정보 조회
  async findOne(id: number): Promise<Item> {
    // 비품 아이디로 비품 조회
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['category'], // 카테고리 정보를 포함하여 조회
    });
    // 비품이 없으면 오류 처리
    if (!item) {
      throw new Error('비품을 찾을 수 없습니다.');
    }
    return item;
  }

  // 특정 비품 정보 수정
  async update(id: number, UpdateItemDto: UpdateItemDto): Promise<Item> {
    // 비품 조회
    const item = await this.itemRepository.findOne({ where: { id } });

    // 비품이 없으면 오류 처리
    if (!item) {
      throw new Error('비품을 찾을 수 없습니다.');
    }

    // 비품 정보 수정 반영
    Object.assign(item, UpdateItemDto);

    // 수정된 비품 저장
    const updatedItem = await this.itemRepository.save(item);

    // 캐시 갱신
    await this.itemCacheService.refreshCache();

    return updatedItem;
  }

  // 특정 비품 삭제
  async delete(id: number): Promise<void> {
    // 비품 조회
    const item = await this.itemRepository.findOne({
      where: { id },
    });

    // 비품이 없으면 오류 처리
    if (!item) {
      throw new Error('비품을 찾을 수 없습니다.');
    }

    // 비품 삭제
    await this.itemRepository.remove(item);
    // 캐시 갱신
    await this.itemCacheService.refreshCache();
  }
}
