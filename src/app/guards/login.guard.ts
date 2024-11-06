import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '@services/token-service';
import { Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const serviceToken = inject(TokenService);
  const router = inject(Router);

  const isValidToken = serviceToken.isValidToken();
  console.log('guardian')
  console.log(isValidToken)
  if (!isValidToken) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
