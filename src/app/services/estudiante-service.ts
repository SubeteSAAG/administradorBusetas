import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { environment } from "@envs/environment.development";
import { ApiResponse } from "@models/api-response";
import { EstudianteModel } from "@models/estudiante";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EstudianteService{

    private readonly http = inject(HttpClient)
    private readonly endpoint = "/Estudiante"
    private readonly apiUrl = environment.API_URL

    public ltsEstudiantes = signal<ApiResponse | any>(null)


    public getLtsEstuaintes(){
        this.http.get<ApiResponse>(`${this.apiUrl}${this.endpoint}/listar`)
        .pipe(tap((response: ApiResponse) => this.ltsEstudiantes.set(response)))
        .subscribe()

    }

    public saveEstudent(estudent: EstudianteModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}`, estudent);
    }


    public editEstudent(estudent: EstudianteModel): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}${this.endpoint}/Actualizar`, estudent);
    }


}