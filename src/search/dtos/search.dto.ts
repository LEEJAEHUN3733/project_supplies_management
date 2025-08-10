import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class SearchItemDto {
  @ApiProperty({
    description: '검색어 (한글, 영어 모두 2글자 이상 입력 필수)',
    minLength: 2,
  })
  @IsString({ message: '검색어는 문자열이어야 합니다.' })
  @Length(2, 50, { message: '검색어는 2자 이상 50자 이하여야 합니다.' })
  name: string;

  @ApiProperty({
    description: '페이지 번호 (기본 1)',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
}
