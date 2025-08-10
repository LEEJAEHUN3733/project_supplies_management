# 비품 관리 시스템 (Supplies Management System)

이 프로젝트는 NestJS를 기반으로 구축된 비품 관리 RESTful API 서버입니다. 비품(Item), 카테고리(Category)는 물론, 사용자(User) 및 비품 대여/반납 이력(Rental History)을 관리하는 기능을 제공합니다. PostgreSQL 데이터베이스와 연동하며, Redis를 이용한 캐싱 최적화와 Swagger를 통한 API 문서화를 지원합니다.

## 기술 스택

- **BackEnd**: `NestJS`, `TypeScript`
- **DataBase**: `PostgreSQL`(`TypeORM`)
- **Caching**: `Redis`
- **API 문서화**: `Swagger`

## 서버 환경

- **Redis** 3.0.504
- **Node.js** 18.x
- **PostgreSQL** 17.x

## 주요 기능

- 카테고리(Category) 관리: 비품 카테고리 CRUD 기능
- 비품(Item) 관리: 비품 정보 CRUD, Redis 캐시를 사용한 비품 목록 성능 최적화
- 사용자(User) 관리: 사용자 정보 CRUD 기능
- 대여/반납 이력(Rental History) 관리: 비품 대여 및 반납 기록 CRUD
- 비품 검색: 비품명을 기준으로 검색 및 페이지네이션 처리 마지막 대여 이력 포함
- 전역 예외 처리: 모든 예외를 일관된 형식으로 처리하는 필터 적용
- API 문서화: Swagger를 사용하여 API 문서 및 테스트 UI 제공

## DB 테이블 구조 설계서

### Category 테이블

| **필드명** | **형태**  | **설명**                |
| ---------- | --------- | ----------------------- |
| `id`       | `integer` | Primary Key. 자동 증가. |
| `name`     | `varchar` | 카테고리명.             |

### Item 테이블

| **필드명**           | **형태**    | **설명**                            |
| -------------------- | ----------- | ----------------------------------- |
| `id`                 | `integer`   | Primary Key. 자동 증가.             |
| `name`               | `varchar`   | 비품명.                             |
| `quantity`           | `integer`   | 수량.                               |
| `status`             | `varchar`   | 비품 상태(`정상`, `수리중`, `폐기`) |
| `category_id`        | `integer`   | 비품이 속한 카테고리의 `id`         |
| `created_by_user_id` | `integer`   | 비품을 등록한 사용자의 `id`         |
| `create_at`          | `timestamp` | 비품 등록 시간.                     |

### User 테이블

| **필드명** | **형태**  | **설명**                |
| ---------- | --------- | ----------------------- |
| `id`       | `integer` | Primary Key. 자동 증가. |
| `name`     | `varchar` | 사용자명.               |

### RentalHistory 테이블

| **필드명**    | **형태**    | **설명**                          |
| ------------- | ----------- | --------------------------------- |
| `id`          | `integer`   | Primary Key. 자동 증가.           |
| `user_id`     | `varchar`   | 대여자(사용자)의 `id`.            |
| `item_id`     | `integer`   | 대여한 비품의 `id`.               |
| `rental_date` | `timestamp` | 대여 날짜.                        |
| `return_date` | `timestamp` | 반납 날짜(`null`일 경우 대여 중). |

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

   `.env` 파일을 프로젝트 루트에 생성하여 환경 변수들을 설정합니다.

   ```bash
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

   `DB_HOST`, `DB_PORT` 등의 설정을 본인의 환경에 맞게 수정하세요.

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
