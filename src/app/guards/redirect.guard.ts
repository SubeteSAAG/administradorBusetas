import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '@services/token-service';
import { Router } from '@angular/router';

export const redirectGuard: CanActivateFn = (route, state) => {
  const serviceToken = inject(TokenService);
  const router = inject(Router);

  const isValidToken = serviceToken.isValidToken();
  if (isValidToken) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true
};
