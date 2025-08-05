import { IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  name: string; // 카테고리 이름
}
