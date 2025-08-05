import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { CreateApiDocument } from './api/v1/swagger/create.document';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiDocumentOptions = new CreateApiDocument().initializeOptions();
  const apiDocument = SwaggerModule.createDocument(app, apiDocumentOptions);

  SwaggerModule.setup('api-docs', app, apiDocument);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
