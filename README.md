# 비품 관리 시스템 (Supplies Management System)

이 프로젝트는 NestJS를 사용한 비품 관리 애플리케이션으로, 비품(Item)과 카테고리(Category)를 관리하고, Redis를 이용한 캐시 최적화를 제공합니다. PostgreSQL 데이터베이스와 연동하여 비품 데이터 및 카테고리 데이터를 관리하며, Swagger UI를 통해 API 문서화와 테스트 기능을 제공합니다.

## 기술 스택

- **NestJS**: 웹 애플리케이션의 기본 구조를 제공하는 Node.js 프레임워크.
- **PostgreSQL**: 관계형 데이터베이스.
- **TypeORM**: TypeScript를 지원하는 ORM으로, PostgreSQL과의 데이터 연동을 처리.
- **Redis**: 오픈 소스 기반의 인 메모리(In-memory) 데이터 저장소, 데이터 조회 성능을 최적화.
- **Swagger**: API 문서화 및 테스트 UI 제공.

## 서버 환경

- **Redis** 3.1.2
- **Node.js** 18.20.8
- **PostgreSQL** 17.5

## 주요 기능

- 카테고리(Category) CRUD
- 비품(Item) CRUD
- Redis 캐시를 사용한 비품 목록 성능 최적화
- API 문서화 (Swagger를 사용하여 API 문서화 및 테스트)
- 비품 목록 캐싱 및 만료 설정

## DB 테이블 구조 설계서

### Category 테이블

| **필드명** | **형태**            | **설명**                                           |
|------------|---------------------|--------------------------------------------------|
| `id`       | `integer`           | Primary Key. 자동 증가(`nextval`)로 관리.          |
| `name`     | `character varying` | 카테고리명.      |

### Item 테이블

| **필드명**  | **형태**               | **설명**                                             |
|-------------|------------------------|----------------------------------------------------|
| `id`        | `integer`              | Primary Key. 자동 증가(`nextval`)로 관리.            |
| `name`      | `character varying`    | 비품명.                                          |
| `quantity`  | `integer`              | 수량.                                             |
| `status`    | `item_status_enum`     | 비품 상태(`정상`, `수리중`, `폐기`)      |
| `createdAt` | `timestamp`            | 비품 등록 시간.                   |
| `categoryId`| `integer`              | 비품이 속한 카테고리의 `id`를 참조하는 외래 키.      |

## 프로젝트 설치

1. **프로젝트 클론**:

   ```bash
   git clone https://github.com/LEEJAEHUN3733/supplies-management.git
   cd supplies-management
   ```

2. **필수 의존성 설치**:

   ```bash
   $ npm install
   ```

3. **환경 설정**:

   ```.env``` 파일을 프로젝트 루트에 생성하여 환경 변수들을 설정합니다.

   ``` bash
   # PostgreSQL 설정
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=category

   # Redis 설정
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # NestJS 설정 (기타 설정)
   PORT=3000
   ```
   ```DB_HOST```, ```DB_PORT``` 등의 설정을 본인의 환경에 맞게 수정하세요.  


## 프로젝트 실행

   ```bash
   # 개발 환경에서 프로젝트 실행
   $ npm run start

   # 개발 환경에서 프로젝트 실행(파일 변경 감지)
   $ npm run start:dev

   # 프로덕션 환경에서 프로젝트 실행
   $ npm run start:prod
   ```

## API 문서화

프로젝트는 Swagger UI를 통해 API 문서화를 제공합니다. Swagger UI는 http://localhost:3000/apidocs 에서 확인할 수 있습니다.

## 라이센스

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
