# 카테고리 생성

## 엔드포인트 (Endpoint)

    `PATCH /users/{id}`

## 기능 설명 (Description)

지정된 `id`를 가진 사용자의 정보를 수정합니다.

## 흐름도

```mermaid
sequenceDiagram
    participant 사용자 as Client
    participant Controller as UserController
    participant Service as UserService
    participant Repository as UserRepository
    participant DB as PostgreSQL DB

    사용자->>Controller: PATCH /users/1 요청 (name: "김철수")
    activate Controller
    Controller->>Controller: DTO 유효성 검사
    Controller->>Service: update(1, dto) 호출
    activate Service

    Service->>Repository: findOne({id: 1}) 호출 (사용자 존재 확인)
    activate Repository
    Repository->>DB: SELECT * FROM "user" WHERE id = 1
    DB-->>Repository: 조회 결과 (사용자 객체 또는 null) 반환
    Repository-->>Service: 조회 결과 전달
    deactivate Repository

    alt 사용자 없음
        Service-->>Controller: 404 Not Found 오류
    else 사용자 있음
        Service->>Repository: save(updatedUser) 호출
        activate Repository
        Repository->>DB: UPDATE 쿼리 실행
        DB-->>Repository: 갱신된 사용자 객체 반환
        deactivate Repository
        Repository-->>Service: 갱신된 사용자 객체 전달
        Service-->>Controller: 갱신된 사용자 객체 전달
        Controller-->>사용자: 200 OK 응답 (갱신된 사용자 객체 포함)
    end
    deactivate Service
    deactivate Controller
```

## 상세 설명

### 성공 흐름

1.  **요청 및 유효성 검사**: 사용자가 수정할 사용자의 `id`와 정보(`name`)를 담아 `PATCH` 요청을 보냅니다. `Controller`는 먼저 DTO의 유효성을 검사합니다.
2.  **사용자 조회**: `Service`는 `id`를 이용해 `Repository`에서 해당 사용자가 존재하는지 조회합니다.
3.  **데이터 갱신**: 사용자가 존재하면, `Service`는 DTO의 내용으로 사용자 객체의 정보를 수정한 뒤 `Repository`의 `save()` 메서드를 호출하여 DB에 `UPDATE` 쿼리를 실행합니다.
4.  **성공 응답**: 성공적으로 갱신된 사용자 정보가 `200 OK` 상태 코드와 함께 반환됩니다.

### 예외 처리 (Exception Handling)

- **400 Bad Request**: DTO 유효성 검사를 통과하지 못할 경우 오류를 반환합니다.
- **404 Not Found**: URL의 `id`에 해당하는 사용자가 존재하지 않을 경우 오류를 반환합니다.
