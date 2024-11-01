import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '@core/services/loading.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private totalRequests = 0;

  constructor(
    private snackBar: MatSnackBar,
    private loadingService: LoadingService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.totalRequests++;
    this.loadingService.setLoading(true);

    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    }

    // Adiciona header específico para TOTVS
    if (request.url.includes('/totvs')) {
      request = request.clone({
        setHeaders: {
          'X-TOTVS-API-Key': localStorage.getItem('totvsApiKey') || '',
        }
      });
    }

    const timeoutId = setTimeout(() => {
      this.loadingService.setLoading(false);
      this.snackBar.open('A requisição está demorando mais que o esperado.', 'OK', {
        duration: 5000
      });
    }, 30000); // 30 segundos

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Log de sucesso se necessário
          clearTimeout(timeoutId);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        clearTimeout(timeoutId);
        let errorMessage = 'Ocorreu um erro na operação.';

        if (error.error instanceof ErrorEvent) {
          // Erro do lado do cliente
          console.error('Erro do cliente:', error.error.message);
        } else {
          // Erro retornado pelo backend
          console.error(
            `Código do erro: ${error.status}, ` +
            `Mensagem: ${error.error?.message || error.message}`
          );

          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Requisição inválida.';
              break;
            case 401:
              errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
              // Redirecionar para login se necessário
              window.location.href = '/login';
              break;
            case 403:
              errorMessage = 'Você não tem permissão para realizar esta operação.';
              break;
            case 404:
              errorMessage = 'Recurso não encontrado.';
              break;
            case 422:
              errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.';
              break;
            case 500:
              errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
              break;
            case 503:
              errorMessage = 'Serviço indisponível. Tente novamente mais tarde.';
              break;
            default:
              errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
          }
        }

        // Não exibe snackbar para erros silenciosos
        if (!request.headers.has('silent-error')) {
          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }

        return throwError(() => error);
      }),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loadingService.setLoading(false);
        }
      })
    );
  }
}