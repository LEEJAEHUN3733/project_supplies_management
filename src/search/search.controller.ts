import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchItemDto } from './dtos/search.dto';
import { SearchResultDto } from './dtos/search-result.dto';

@ApiTags('검색 API')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('items')
  @ApiOperation({
    summary: '비품명으로 검색',
    description: '비품명을 검색하여 결과를 출력합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '검색 결과 리스트 반환',
    type: [SearchResultDto],
  })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 검색어 또는 페이지 번호입니다.',
  })
  async searchItems(
    @Query() searchDto: SearchItemDto,
  ): Promise<SearchResultDto[]> {
    return this.searchService.searchItems(searchDto.name, searchDto.page);
  }
}
