import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { CreateApiDocument } from './api/v1/swagger/create.document';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  // NestJs 애플리캐이션 생성
  const app = await NestFactory.create(AppModule);

  // Swagger 문서화 옵션을 초기화(Swagger 문서에 대한 설정을 가져옴)
  const apiDocumentOptions = new CreateApiDocument().initializeOptions();
  // Swagger 문서 객체 생성
  const apiDocument = SwaggerModule.createDocument(app, apiDocumentOptions);

  // '/apidocs'경로에서 Swagger UI 제공
  SwaggerModule.setup('apidocs', app, apiDocument);

  // 지정도니 포트에서 서버를 실행. 환경변수PORT가 없을 시 3000포트로 시작
  await app.listen(process.env.PORT ?? 3000);
}
// bootstrap 함수 실행
bootstrap();
