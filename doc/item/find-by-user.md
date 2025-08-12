# 카테고리 생성

## 엔드포인트 (Endpoint)

    `GET /items/created-by/{userId}

## 기능 설명 (Description)

URL 경로에 포함된 `userId`와 일치하는 사용자가 등록한 모든 비품 목록을 조회합니다.

## 흐름도

```mermaid
sequenceDiagram
    participant 사용자 as Client
    participant Controller as ItemController
    participant Service as ItemService
    participant UserRepo as UserRepository
    participant ItemRepo as ItemRepository
    participant DB as PostgreSQL DB

    사용자->>Controller: GET /items/created-by/1 요청
    activate Controller
    Controller->>Controller: Path Parameter 'userId' 파싱 및 검증
    Controller->>Service: findByUser(1) 호출
    activate Service

    Service->>UserRepo: findOne({id: 1}) 호출
    activate UserRepo
    UserRepo->>DB: SELECT * FROM "user" WHERE id = 1
    DB-->>UserRepo: 조회 결과 (사용자 객체 또는 null) 반환
    UserRepo-->>Service: 조회 결과 전달
    deactivate UserRepo

    alt 조회된 사용자가 없는 경우 (결과가 null)
        Service-->>Controller: 404 Not Found 오류 발생
        Controller-->>사용자: 404 Not Found 응답
    else 조회된 사용자가 있는 경우
        Service->>ItemRepo: find({createdByUserId: 1}) 호출
        activate ItemRepo
        ItemRepo->>DB: SELECT * FROM item WHERE created_by_user_id = 1 ORDER BY created_at DESC
        DB-->>ItemRepo: 비품 목록 데이터 반환
        ItemRepo-->>Service: 비품 목록 전달
        deactivate ItemRepo

        Service-->>Controller: 비품 목록 전달
        Controller-->>사용자: 200 OK 응답 (비품 목록 포함)
    end
    deactivate Service
    deactivate Controller
```

## 상세 설명

### 성공 흐름

1.  **요청**: 사용자가 특정 사용자가 등록한 비품을 조회하기 위해 URL 경로에 `userId`를 포함하여 요청합니다.
2.  **사용자 유효성 확인**: `Controller`는 `Service`의 `findByUser()`를 호출합니다. `Service`는 가장 먼저 `UserRepository`를 통해 요청된 `userId`에 해당하는 사용자가 실제로 존재하는지 확인합니다.
3.  **데이터 조회**: 사용자가 유효한 것으로 확인되면, `Service`는 `ItemRepository`를 통해 해당 `createdByUserId`를 가진 모든 비품을 데이터베이스에서 조회합니다.
4.  **성공 응답**: 조회된 비품 목록(해당 유저가 등록한 비품이 없으면 빈 배열 `[]`)이 `200 OK` 상태 코드와 함께 사용자에게 반환됩니다.

### 예외 처리 (Exception Handling)

- URL 경로에 포함된 `userId`가 숫자가 아닌 경우, NestJS의 `ParseIntPipe`에 의해 유효성 검사에 실패하여 `400 Bad Request`오류를 반환합니다.
- URL 경로의 `userId`에 해당하는 사용자가 데이터베이스에 존재하지 않을 경우, "해당 ID의 사용자를 찾을 수 없습니다." 메시지와 함께 `404 Not Found`오류를 반환합니다.
