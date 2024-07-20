import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@services/token-service';
import { LoadingService } from '@services/loading-service';


export const ErrorApiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const serviceToken = inject(TokenService);
    const serviceLoading = inject(LoadingService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        console.error('Recurso no encontrado', error);
      } else if (error.status === undefined || error.status === 0) {
        console.error('Error de CORS o de red', error);
        serviceLoading.hide()
      } else if (error.status === 401) {
        console.error('No autorizado', error);
        serviceToken.removeToken()
      } else if (error.status === 500) {
        console.error('Internal server', error);
      }else{
        console.error(`Error code: ${error.status}, message: ${error.message}`);
      }
      return throwError(() => error);
    })
  );
};
