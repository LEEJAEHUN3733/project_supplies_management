import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch() // 이 필터는 모든 종류의 예외를 처리함
export class AllExceptionsFilter implements ExceptionFilter {
  // 예외가 발생했을 때 실행되는 메서드
  // @param exception = 발생한 예외 객체
  // @param host - ArgumentsHost는 현재 요청/응답 컨텍스트에 접근할 수 있는 객체
  catch(exception: unknown, host: ArgumentsHost) {
    // HTTP 관련 컨텍스트만 가져온다(Rest API의 경우)
    const ctx = host.switchToHttp();
    // express의 Response 객체 타입으로 응답 객체를 가져온다.
    const response = ctx.getResponse<Response>();
    // express의 Request 객체 타입으로 요청 객체를 가져온다.
    const request = ctx.getRequest<Request>();

    // 예외가 HttpException 타입이면 해당 예외가 가진 HTTP 상태 코드를 사용하고,
    // 그렇지 않을 시 서버 내부 상태 코드 500(INTERNAL_SERVER_ERROR)를 사용한다.
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 예외 메세지 내용도 HttpException 타입일 경우에는 getResponse()로 가져오고,
    // 그렇지 않을 시 기본 메세지인 'Internal server error'를 설정
    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // getResponse()의 반환값이 객체이고, 그 안에 message 필드가 있으면 message 필드만 따로 클라이언트에 전달
    if (typeof message === 'object' && (message as any).message) {
      message = (message as any).message;
    }

    // 최종적으로 HTTP 응답을 status 코드와 함께 JSON 형태로 전송
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
