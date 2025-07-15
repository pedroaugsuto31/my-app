import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const startTime = Date.now();

    console.log('TimingConnectionInterceptor execute before');

    // await new Promise(resolve => setTimeout(resolve, 10000));

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = Date.now() - startTime;
        console.log(
          `TimingConnectionInterceptor took ${elapsedTime}ms to execute`,
        );
      }),
    );
  }
}
