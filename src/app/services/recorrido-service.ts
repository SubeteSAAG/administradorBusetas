import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment.development";
import { ApiResponse } from "@models/api-response";
import { tap } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class RecorridoService{

    private readonly http = inject(HttpClient)
    private readonly endpoint = "/Recorrido"
    private readonly apiUrl = environment.API_URL

    public ltsRecorridos = signal<ApiResponse | any>(null)

    public getLtsRecorridos(){
        this.http.get<ApiResponse>(`${this.apiUrl}${this.endpoint}/listarRecorridos`)
        .pipe(tap((response: ApiResponse) => this.ltsRecorridos.set(response)))
        .subscribe()

    }


}
