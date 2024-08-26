import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment.development";
import { ApiResponse } from "@models/api-response";
import { EmpresaModel } from "@models/empresa";
import { Observable, tap } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class EmpresaService{

    private readonly http = inject(HttpClient)
    private readonly endpoint = "/Empresas"
    private readonly apiUrl = environment.API_URL

    public ltsEmpresas = signal<ApiResponse | any>(null)


    public getLtsEmpresas(){
        this.http.get<ApiResponse>(`${this.apiUrl}${this.endpoint}/listar`)
        .pipe(tap((response: ApiResponse) => this.ltsEmpresas.set(response)))
        .subscribe()

    }

    public saveEempresa(enterprise: EmpresaModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}`, enterprise);
    }



}