import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { CreateApiDocument } from './api/v1/swagger/create.document';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  // NestJs 애플리캐이션 생성
  const app = await NestFactory.create(AppModule);

  // 전역 ExceptionFilter 적용
  app.useGlobalFilters(new AllExceptionsFilter());

  // 전역 ValidationPipe 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 선언된 속성만 허용
      forbidNonWhitelisted: true, // whitelist에 없는 속성이 요청에 있으면 에러 발생
      transform: true, // 요청이 들어온 JSON 데이터를 자동으로 DTO 클래스 인스턴스로 변환
      transformOptions: { enableImplicitConversion: false }, // 자동 변환으로 인한 의도치 않은 타입 변환 방지
    }),
  );

  // Swagger 문서화 옵션을 초기화(Swagger 문서에 대한 설정을 가져옴)
  const apiDocumentOptions = new CreateApiDocument().initializeOptions();
  // Swagger 문서 객체 생성
  const apiDocument = SwaggerModule.createDocument(app, apiDocumentOptions);

  // '/apidocs'경로에서 Swagger UI 제공
  SwaggerModule.setup('apidocs', app, apiDocument);

  // 지정된 포트에서 서버를 실행. 환경변수PORT가 없을 시 3000포트로 시작
  await app.listen(process.env.PORT ?? 3000);
}
// bootstrap 함수 실행
bootstrap();
