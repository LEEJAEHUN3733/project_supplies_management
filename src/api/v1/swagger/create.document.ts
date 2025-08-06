import { DocumentBuilder } from '@nestjs/swagger';

// Swagger API 문서를 설정하는 클래스
export class CreateApiDocument {
  // Swagger 문서 설정을 위한 객체 초기화
  private readonly doc: DocumentBuilder = new DocumentBuilder();

  // Swagger 문서의 기본 설정을 초기화하는 메서드
  public initializeOptions() {
    return this.doc
      .setTitle('비품관리 API') // API 명세서의 제목 설정
      .setDescription('신입 백엔드 개발자 비품관리 API 서버 구축과제(3일 코스)') // API 명세서의 설명 설정
      .setVersion('1.0') // API 명세서의 버전 설정
      .setContact('이재훈', '', 'wogns9433@naver.com') // API 문서의 연락처 정보 설정(이름, URL, 이메일)
      .build(); // 설정 적용 후 Swagger 문서 생성
  }
}
