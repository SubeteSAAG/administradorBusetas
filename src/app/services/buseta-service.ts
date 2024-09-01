import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { ApiResponse } from "@models/api-response";
import { AsignarBusetaRutaModel, BusetaModel } from "@models/buseta";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BusetaService{


    public ltsBusetas = signal<ApiResponse | any>(null)
    private readonly http = inject(HttpClient)
    private readonly endpoint = "/Busetas"
    private readonly apiUrl = environment.API_URL

    constructor(){
    }

    public getLtsBusetas(){
        this.http.get<ApiResponse>(`${this.apiUrl}${this.endpoint}/listar`)
        .pipe(tap((data: ApiResponse) => this.ltsBusetas.set(data)))
        .subscribe()

    }

    public saveBuseta(buseta: BusetaModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/Crear`, buseta);
    }


    public editBuseta(buseta: BusetaModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/Actualizar`, buseta);
    }


    public asignarBusetaRuta(asignar: AsignarBusetaRutaModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/AsignarBusetaRuta`, asignar);
    }

    

}