import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

    constructor(private router: Router){}

    saveToken(token: string) {
        if (this.isBrowser()) {
            setCookie('token', token, { expires: 365, path: '/' });
        }
    }

    getToken() {
        if (this.isBrowser()) {
            return getCookie('token');
        }
        return null;
    }

    removeToken() {
        if (this.isBrowser()) {
            removeCookie('token');
            this.router.navigate(['/login']);
        }
    }

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    }
}
