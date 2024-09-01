import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '@services/token-service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  } else {
    return next(req);
  }
};


/*

if(req.context.get(CHECK_TOKEN)){
  const isValidToken = this.tokenService.isValidToken()
  if(isValidToken){
    return addTokenHeaders()
  }else{
    return llamarNuevaApi()
  }
}
return next(req)

llamarNuevaApi(req, next){
  const isValidToken = this.tokenService.isValidToken()
  if(isValidToken){
     return serviceLogin.login(user, pass).pipe(
      switchMap(() => this.addToken(req, next))
    )
  }
  return next(req)
}

*/