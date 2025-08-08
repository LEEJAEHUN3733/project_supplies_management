import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from 'src/app/app.service';

// localhost:3000/ 에 해당하는 Controller 클래스
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint() // Swagger API 명세서에서 제외
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }
}
