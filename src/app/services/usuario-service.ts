import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { ApiResponse } from "@models/api-response";


import { UsuarioModel } from "@models/usuario";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService{


    public ltsUsuariosConducotres = signal<ApiResponse | any>(null)
    public ltsUsuariosRepresentantes = signal<ApiResponse | any>(null)

    private readonly http = inject(HttpClient)
    private readonly endpoint = "/Usuarios"
    private readonly apiUrl = environment.API_URL

    constructor(){
    }

    public getLtsUsuariosConducotres(){
        this.http.get<ApiResponse>(`${this.apiUrl}${this.endpoint}/listaConductores`)
        .pipe(tap((response: ApiResponse) => this.ltsUsuariosConducotres.set(response)))
        .subscribe()

    }

    public getLtsUsuariosRepresentantes(){
        this.http.get<ApiResponse>(`${this.apiUrl}${this.endpoint}/listaRepresentantes`)
        .pipe(tap((response: ApiResponse) => this.ltsUsuariosRepresentantes.set(response)))
        .subscribe()

    }


    public saveUsuarioConductor(usuario: UsuarioModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/CrearUsuarioConductor`, usuario);
    }


    
    public saveUsuarioRepresentante(usuario: UsuarioModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/CrearUsuarioRepresentante`, usuario);
    }

}