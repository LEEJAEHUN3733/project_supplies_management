# 비품 관리 시스템 (Supplies Management System)

[![Node.js CI](https://github.com/LEEJAEHUN3733/supplies-management/actions/workflows/node.js.yml/badge.svg)](https://github.com/LEEJAEHUN3733/supplies-management/actions/workflows/node.js.yml)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

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
| `total_quantity`     | `integer`   | 총 보유 수량.                       |
| `current_quantity`   | `integer`   | 현재 보유 수량.                     |
| `status`             | `varchar`   | 비품 상태(`정상`, `수리중`, `폐기`) |
| `category_id`        | `integer`   | 비품이 속한 카테고리의 `id`         |
| `created_by_user_id` | `integer`   | 비품을 등록한 사용자의 `id`         |
| `created_at`         | `timestamp` | 비품 등록 시간.                     |
| `deleted_at`         | `timestamp` | 소프트 삭제.                        |

### User 테이블

| **필드명**   | **형태**    | **설명**                |
| ------------ | ----------- | ----------------------- |
| `id`         | `integer`   | Primary Key. 자동 증가. |
| `name`       | `varchar`   | 사용자명.               |
| `deleted_at` | `timestamp` | 소프트 삭제.            |

### RentalHistory 테이블

| **필드명**    | **형태**    | **설명**                          |
| ------------- | ----------- | --------------------------------- |
| `id`          | `integer`   | Primary Key. 자동 증가.           |
| `user_id`     | `varchar`   | 대여자(사용자)의 `id`.            |
| `item_id`     | `integer`   | 대여한 비품의 `id`.               |
| `quantity`    | `integer`   | 대여 수량.                        |
| `rental_date` | `timestamp` | 대여 날짜.                        |
| `return_date` | `timestamp` | 반납 날짜(`null`일 경우 대여 중). |

## 주요 기능

- **카테고리(Category) 관리 API**
  - `POST /category` : [새 카테고리 등록](doc/category/create.md)
  - `GET /category` : [전체 카테고리 목록 조회](doc/category/get-all.md)
  - `PATCH /category/{id}` : [카테고리 갱신](doc/category/update.md)
  - `DELETE /category/{id}` : [카테고리 삭제](doc/category/delete.md)

- **비품(Item) 관리 API**
  - `POST /items` : [새 비품 등록](doc/item/create.md)
  - `GET /items` : [전체 비품 목록 조회](doc/item/get-all.md)
  - `GET /items/category` : [특정 카테고리에 속한 비품 조회](doc/item/find-by-category.md)
  - `GET /items/created-by/{userId}` : [특정 유저가 등록한 비품 조회](doc/item/find-by-user.md)
  - `GET /items/{id}` : [특정 비품 상세 정보 조회](doc/item/get-by-id.md)
  - `PATCH /items/{id}` : [특정 비품 정보 수정](doc/item/update.md)
  - `DELETE /items/{id}` : [비품 삭제](doc/item/delete.md)

- **사용자 관리 API**
  - `POST /users` : [새 사용자 등록](doc/user/create.md)
  - `GET /users` : [전체 사용자 조회](doc/user/get-all.md)
  - `GET /users/{id}` : [특정 사용자 조회](doc/user/get-by-id.md)
  - `PATCH /users/{id}` : [사용자 정보 갱신](doc/user/update.md)
  - `DELETE /users/{id}` : [사용자 삭제](doc/user/delete.md)

- **대여/반납 이력 관리 API**
  - `POST /rental-history/rent/{userId}/{itemId}` : [비품 대여](doc/rental-history/rent.md)
  - `PATCH /rental-history/return/{rentId}` : [비품 반납](doc/rental-history/return.md)
  - `GET /rental-history` : [전체 대여/반납 이력 조회](doc/rental-history/get-all.md)
  - `GET /rental-history/item/{itemId}` : [특정 비품의 대여/반납 이력 조회](doc/rental-history/find-by-item.md)
  - `GET /rental-history/users/{userId}` : [특정 유저의 대여/반납 이력 조회](doc/rental-history/find-by-user.md)

- **비품 검색 API**
  - `GET /search/items` : [비품명으로 검색](doc/search/search.md)

- **아키텍처 특징**
  - **전역 예외 처리** : 모든 예외를 일관된 형식으로 처리하는 필터 적용
  - **API 문서화** : Swagger를 사용하여 API 문서 및 테스트 UI 제공

## 프로젝트 설치

1. **프로젝트 복제**:

   ```bash
   git clone https://github.com/LEEJAEHUN3733/supplies-management.git
   cd supplies-management
   ```

2. **필수 의존성 설치**:

   ```bash
   $ npm install
   ```

3. **환경 변수 설정**:

   `.env` 파일을 프로젝트 루트에 생성하여 환경 변수들을 설정합니다.

   ```bash
   # Application
   PORT=3000

   # PostgreSQL 설정
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=yourpassword
   DB_DATABASE=supplies_management

   # Redis 설정
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

   `DB_HOST`, `DB_PORT` 등의 설정을 본인의 환경에 맞게 수정하세요.

4. **데이터베이스 마이그레이션**

   ```bash
   npm run migration:run
   ```

5. **애플리케이션 실행**

   ```bash
   # 개발 환경에서 프로젝트 실행
   $ npm run start

   # 개발 환경에서 프로젝트 실행(파일 변경 감지)
   $ npm run start:dev

   # 프로덕션 환경에서 프로젝트 실행
   $ npm run build
   $ npm run start:prod
   ```

## API 문서화

프로젝트는 Swagger UI를 통해 API 문서화를 제공합니다. Swagger UI는 http://localhost:3000/apidocs 에서 확인할 수 있습니다.

## 라이센스

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
