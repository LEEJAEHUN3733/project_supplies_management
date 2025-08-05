import { DocumentBuilder } from '@nestjs/swagger';

export class CreateApiDocument {
  private readonly doc: DocumentBuilder = new DocumentBuilder();

  public initializeOptions() {
    return this.doc
      .setTitle('비품관리 API') // 문서 제목
      .setDescription('신입 백엔드 개발자 비품관리 API 서버 구축과제(3일 코스)') // 문서 설명
      .setVersion('1.0') // 문서 버전
      .setContact('이재훈', '', 'wogns9433@naver.com')
      .build();
  }
}
