import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { ApiResponse } from "@models/api-response";
import { BusetaModel } from "@models/buseta";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BusetaService{


    public ltsBusetas = signal<BusetaModel[]>([])
    private readonly http = inject(HttpClient)
    private readonly endpoint = "/Busetas"
    private readonly apiUrl = environment.API_URL

    constructor(){
        this.getLtsBusetas()
    }

    public getLtsBusetas(){
        this.http.get<BusetaModel[]>(`${this.apiUrl}${this.endpoint}/listar`)
        .pipe(tap((data: BusetaModel[]) => this.ltsBusetas.set(data)))
        .subscribe()

    }

    public saveBuseta(buseta: BusetaModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/Crear`, buseta);
    }


    

}