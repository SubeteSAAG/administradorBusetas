import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "@envs/environment.development";
import { ApiResponse } from "@models/api-response";
import { CreateEmpresaModel, EditEmpresaModel } from "@models/empresa";
import { Observable, tap } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class EmpresaService{

    private readonly http = inject(HttpClient)
    private readonly endpoint = "/Empresas"
    private readonly apiUrl = environment.API_URL

    public ltsEmpresas = signal<ApiResponse | any>(null)
    public ltsEmpresasByUsers = signal<ApiResponse | any>(null)


    public getLtsEmpresas(){
        this.http.get<ApiResponse>(`${this.apiUrl}${this.endpoint}/Listar`)
        .pipe(tap((response: ApiResponse) => this.ltsEmpresas.set(response)))
        .subscribe()
    }

    public getLtsEmpresasByUsers(){
        this.http.get<ApiResponse>(`${this.apiUrl}${this.endpoint}/Usuarios`)
        .pipe(tap((response: ApiResponse) => this.ltsEmpresasByUsers.set(response)))
        .subscribe()
    }


    public saveEempresa(enterprise: CreateEmpresaModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}`, enterprise);
    }

    public editEempresa(enterprise: EditEmpresaModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}`, enterprise);
    }


}