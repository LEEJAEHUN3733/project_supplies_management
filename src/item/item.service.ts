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
import { User } from 'src/user/user.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) // Item 엔티티에 대한 리포지토리 주입
    private itemRepository: Repository<Item>, // 비품 리포지토리

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Category) // Category 엔티티에 대한 리포지토리 주입
    private categoryRepository: Repository<Category>, // 카테고리 리포지토리
    private itemCacheService: ItemCacheService, // ItemCacheService 주입
    private readonly redisService: RedisService, // RedisService 주입
  ) {}

  // 새 비품 등록
  async create(createItemDto: CreateItemDto): Promise<Item> {
    // 유저 조회
    const user = await this.userRepository.findOne({
      where: { id: createItemDto.createdByUserId },
    });
    if (!user) {
      throw new NotFoundException(
        '비품을 등록하려는 사용자를 찾을 수 없습니다.',
      );
    }

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
      totalQuantity: createItemDto.quantity, // DTO의 quantity를 총수량으로
      currentQuantity: createItemDto.quantity, // 현재 수량도 총수량과 동일하게 처리
      status: ItemStatus.NORMAL, // 비품의 초기상태 설정(NORMAL)
      categoryId: createItemDto.categoryId,
      createdByUserId: createItemDto.createdByUserId,
    });

    // 비품 저장
    const savedItem = await this.itemRepository.save(item);

    // Redis Pub/Sub를 사용하여 이벤트 발행
    const eventPayload = {
      id: savedItem.id,
      name: savedItem.name,
    };
    this.redisService
      .publish('item_created', JSON.stringify(eventPayload))
      .then(() => {
        console.log(
          `이벤트 발행 성공: item_created, 페이로드: ${JSON.stringify(eventPayload)}`,
        );
      })
      .catch((err) => {
        console.error(`이벤트 발행 실패: ${err}`);
      });

    return savedItem;
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

    // 비품 수량 수정
    if (updateItemDto.totalQuantity != null) {
      // 총 수량의 변화량 계산
      // ex) 100개 -> 120개 변경 시 difference = +20
      const quantityDifference =
        updateItemDto.totalQuantity - item.totalQuantity;

      // 현재 수량에도 동일한 변화량 적용
      item.currentQuantity += quantityDifference;

      // 현재 수량이 0보다 작아지는것 방지
      if (item.currentQuantity < 0) {
        throw new BadRequestException(
          '현재 대여된 수량보다 적게 총 재고를 설정할 수 없습니다.',
        );
      }
    }

    // DTO의 다른 필드들을 기존 item 객체에 병합
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
    await this.itemRepository.softRemove(item);
  }

  // 특정 유저가 등록한 비품 조회
  async findByUser(userId: number): Promise<Item[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('해당 ID의 사용자를 찾을 수 없습니다.');
    }
    return this.itemRepository.find({
      where: { createdByUserId: userId },
      order: { createdAt: 'DESC' },
    });
  }
}
