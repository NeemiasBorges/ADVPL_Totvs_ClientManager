import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, { response: HttpResponse<any>, timestamp: number }>();
  private maxAge = 5 * 60 * 1000; // 5 minutos

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Não faz cache de métodos diferentes de GET
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    // Não faz cache se especificado no header
    if (request.headers.has('no-cache')) {
      return next.handle(request);
    }

    const cachedResponse = this.cache.get(request.urlWithParams);
    if (cachedResponse) {
      const age = Date.now() - cachedResponse.timestamp;
      if (age < this.maxAge) {
        return of(cachedResponse.response);
      } else {
        this.cache.delete(request.urlWithParams);
      }
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(request.urlWithParams, {
            response: event,
            timestamp: Date.now()
          });
        }
      })
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
