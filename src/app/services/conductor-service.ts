import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { environment } from "@envs/environment";
import { ApiResponse } from "@models/api-response";
import { BusetaModel } from "@models/buseta";
import { ConductorModel } from "@models/conductor";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ConductorService{


    public ltsConductor = signal<ConductorModel[]>([])
    private readonly http = inject(HttpClient)
    private readonly endpoint = "/Usuarios"
    private readonly apiUrl = environment.API_URL

    constructor(){
        this.getLtsBusetas()
    }

    public getLtsBusetas(){
        this.http.get<ConductorModel[]>(`${this.apiUrl}${this.endpoint}/listaConductores`)
        .pipe(tap((data: ConductorModel[]) => this.ltsConductor.set(data)))
        .subscribe()

    }

    /*public saveBuseta(buseta: ConductorModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/Crear`, buseta);
    }*/


}