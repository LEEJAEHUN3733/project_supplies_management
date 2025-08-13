# 카테고리 생성

## 엔드포인트 (Endpoint)

`DELETE /items/{id}`

## 기능 설명 (Description)

지정된 `id`를 가진 비품을 **소프트 삭제(Soft Delete)**합니다. 데이터베이스에서 실제 행이 삭제되지 않고, `deletedAt` 컬럼에 삭제된 시간이 기록됩니다.

## 흐름도

```mermaid
sequenceDiagram
    participant 사용자 as Client
    participant Controller as ItemController
    participant Service as ItemService
    participant Repository as ItemRepository
    participant DB as PostgreSQL DB

    사용자->>Controller: DELETE /items/5 요청
    activate Controller
    Controller->>Controller: Path Parameter 'id' 파싱 및 검증
    Controller->>Service: delete(5) 호출
    activate Service
    Service->>Repository: findOne({id: 5}) 호출
    activate Repository
    Repository->>DB: SELECT * FROM item WHERE id = 5
    DB-->>Repository: 조회 결과 (비품 객체 또는 null) 반환
    Repository-->>Service: 조회 결과 전달
    deactivate Repository

    alt 조회된 비품이 없는 경우
        Service-->>Controller: 404 Not Found 오류 ("비품을 찾을 수 없습니다.")
        Controller-->>사용자: 404 Not Found 응답
    else 조회된 비품이 있는 경우
        Service->>Repository: softRemove(item) 호출
        activate Repository
        Repository->>DB: UPDATE item SET "deletedAt" = NOW() WHERE id = 5
        DB-->>Repository: 갱신 완료
        deactivate Repository
        Repository-->>Service: 삭제 처리 완료
        Service-->>Controller: 삭제 처리 완료
        Controller-->>사용자: 200 OK 응답
    end
    deactivate Service
    deactivate Controller
```

## 상세 설명

### 성공 흐름

1.  **요청**: 사용자가 삭제할 비품의 `id`를 URL 경로에 담아 `DELETE /items/{id}`로 요청합니다.
2.  **비품 조회**: `Service`는 `id`를 이용해 `Repository`에서 해당 비품이 존재하는지 먼저 조회합니다.
3.  **소프트 삭제 실행**: 비품이 존재하면, `Repository`의 `softRemove()` 메서드를 호출합니다. 이 메서드는 DB에서 행을 직접 삭제하는 대신, 해당 행의 `deletedAt` 컬럼에 현재 시간을 기록하여 '삭제된 상태'로 표시합니다.
4.  **성공 응답**: 삭제가 성공적으로 완료되면 사용자에게 `200 OK` 상태 코드를 응답합니다.

### 예외 처리 (Exception Handling)

- URL 경로에 포함된 `id`가 숫자가 아닌 경우, NestJS의 `ParseIntPipe`에 의해 유효성 검사에 실패하여 `400 Bad Request` 오류를 반환합니다.
- `id`에 해당하는 비품이 데이터베이스에 존재하지 않을 경우, "비품을 찾을 수 없습니다." 메시지와 함께 `404 Not Found` 오류를 반환합니다.
