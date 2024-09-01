import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, tap  } from 'rxjs';
import { environment}  from '@envs/environment.development'
import { HttpClient } from '@angular/common/http';
import { TokenService } from '@services/token-service'
import { ResponseLogin } from '@models/response-login'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    apiUrl = environment.API_URL

    constructor(
        private http: HttpClient,
        private serviceToken: TokenService
    ){

    }


    login(username: string, password: string){
        return this.http.post<ResponseLogin>(`${this.apiUrl}/Auth/login`,{
            username,
            password
        }).pipe(
            tap(response => {
                console.log(response)
                this.serviceToken.saveToken(response.data.token)
                this.serviceToken.saveRefreshToken(response.data.refreshToken)
                this.serviceToken.setDetailUser(response.data.usuario)
            })
        )
    }

    logout(){
        this.serviceToken.removeToken()
    }

}