import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Usuario } from '@models/response-login';

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

    saveRefreshToken(token: string) {
        if (this.isBrowser()) {
            setCookie('refresh-token', token, { expires: 365, path: '/' });
        }
    }

    getRefreshToken() {
        if (this.isBrowser()) {
            return getCookie('refresh-token');
        }
        return null;
    }

    removeRefreshToken() {
        if (this.isBrowser()) {
            removeCookie('refresh-token');
            this.router.navigate(['/login']);
        }
    }

    isValidToken(){
        const token = this.getToken()
        if(!token){
            return false
        }
        const decodeToken = jwtDecode<JwtPayload>(token)
        if(decodeToken && decodeToken?.exp){
            const tokenDate = new Date(0)
            tokenDate.setUTCSeconds(decodeToken.exp)
            const today = new Date()
            return tokenDate.getTime() > today.getTime()
        }
        return false
    }

    isValidRefreshToken(): boolean {
        const token = this.getRefreshToken();
        if (!token) {
          return false;
        }
      
        // Validar la estructura del token
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.error('Invalid token format');
          return false;
        }
      
        try {
          const decodeToken = jwtDecode<JwtPayload>(token);
          if (decodeToken && decodeToken.exp) {
            const tokenDate = new Date(0);
            tokenDate.setUTCSeconds(decodeToken.exp);
            console.log("tiempo token-->", tokenDate);
            const today = new Date();
            return tokenDate.getTime() > today.getTime();
          }
        } catch (error) {
          console.error('Failed to decode token', error);
          return false;
        }
      
        return false;
    }

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    }


    setDetailUser(user: Usuario) {
        if (this.isBrowser()) {
            const userJson = JSON.stringify(user);
            setCookie('user', userJson);
        }
    }

    getDetailUser(): Usuario | null {
        if (this.isBrowser()) {
            const userJson = getCookie('user');
            if (userJson) {
                return JSON.parse(userJson) as Usuario;
            }
        }
        return null;
    }
    
}
