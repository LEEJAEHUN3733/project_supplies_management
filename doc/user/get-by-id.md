# 카테고리 생성

## 엔드포인트 (Endpoint)

    `GET /users{id}`

## 기능 설명 (Description)

    URL 경로에 포함된 `id`와 일치하는 특정 사용자 한 명의 정보를 조회합니다.

## 흐름도

```mermaid
   sequenceDiagram
    participant 사용자 as Client
    participant Controller as UserController
    participant Service as UserService
    participant Repository as UserRepository
    participant DB as PostgreSQL DB

    사용자->>Controller: GET /users/1 요청
    activate Controller
    Controller->>Controller: Path Parameter 'id' 파싱 및 검증
    Controller->>Service: findUser(1) 호출
    activate Service
    Service->>Repository: findOne({id: 1}) 호출
    activate Repository
    Repository->>DB: SELECT * FROM "user" WHERE id = 1
    DB-->>Repository: 조회 결과 (사용자 객체 또는 null) 반환
    Repository-->>Service: 조회 결과 전달
    deactivate Repository

    alt 조회된 사용자가 없는 경우
        Service-->>Controller: 404 Not Found 오류 ("사용자를 찾을 수 없습니다.")
        Controller-->>사용자: 404 Not Found 응답
    else 조회된 사용자가 있는 경우
        Service-->>Controller: 사용자 객체 전달
        Controller-->>사용자: 200 OK 응답 (사용자 객체 포함)
    end
    deactivate Service
    deactivate Controller
```

## 상세 설명

### 성공 흐름

1.  **요청**: 사용자가 조회할 특정 사용자의 `id`를 URL 경로에 담아 `GET /users/{id}`로 요청합니다.
2.  **서비스 호출**: `UserController`는 URL의 `id`를 파싱하여 `UserService`의 `findUser()` 메서드를 호출합니다.
3.  **데이터 조회**: `UserService`는 `UserRepository`를 통해 요청된 `id`와 일치하는 사용자를 데이터베이스에서 조회합니다.
4.  **성공 응답**: 조회된 사용자 객체가 `200 OK` 상태 코드와 함께 사용자에게 반환됩니다.

### 예외 처리 (Exception Handling)

- URL 경로에 포함된 `id`가 숫자가 아닌 경우, `ParseIntPipe`에 의해 `400 Bad Request`오류를 반환합니다.
- `id`에 해당하는 사용자가 데이터베이스에 존재하지 않을 경우, "사용자를 찾을 수 없습니다." 메시지와 함께 `404 Not Found`오류를 반환합니다.
