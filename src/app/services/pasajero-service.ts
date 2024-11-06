import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { environment } from "@envs/environment.development";
import { ApiResponse } from "@models/api-response";
import { EstudianteModel } from "@models/estudiante";
import { AsignarPasajeroRutaModel, PasajeroEditModel, PasajeroModel } from "@models/pasajero";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PasajeroService{

    private readonly http = inject(HttpClient)
    private readonly endpoint = "/Pasajero"
    private readonly apiUrl = environment.API_URL

    public ltsPasajeros = signal<ApiResponse | any>(null)


    public getLtsPasajeros(){
        this.http.get<ApiResponse>(`${this.apiUrl}${this.endpoint}/listar`)
        .pipe(tap((response: ApiResponse) => this.ltsPasajeros.set(response)))
        .subscribe()

    }

    public savePasajero(pasajero: PasajeroModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/Crear`, pasajero);
    }


    public editPasajero(pasajero: PasajeroEditModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/Actualizar`, pasajero);
    }

    public asignarPasajeroRuta(asignar: AsignarPasajeroRutaModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/AsignarPasajeroRutaBuseta`, asignar);
    }


}