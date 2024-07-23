import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { environment } from "@envs/environment.development";
import { ApiResponse } from "@models/api-response";
import { RutaModel } from "@models/ruta";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RutaService{

    private readonly http = inject(HttpClient)
    private readonly endpoint = "/Rutas"
    private readonly apiUrl = environment.API_URL

    public ltsRutaByEmpresa = signal<ApiResponse | any>(null)


    public getLtsRutaByEmpresa(){
        this.http.get<ApiResponse>(`${this.apiUrl}${this.endpoint}/listar/1`)
        .pipe(tap((response: ApiResponse) => this.ltsRutaByEmpresa.set(response)))
        .subscribe()

    }

    public saveRoute(pasajero: RutaModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/Crear`, pasajero);
    }


    public editRoute(pasajero: RutaModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/Actualizar`, pasajero);
    }

}