// busqueda.service.ts

import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarraMenuService {
    
    private guardarSubject = new Subject<void>();
    private editarSubject = new Subject<void>();
    private buscarSubject = new Subject<{ tipo: string, valor: string }>();

    onGuardar() {
        this.guardarSubject.next();
    }

    onEditar() {
        this.editarSubject.next();
    }

    onBuscar(data: { tipo: string, valor: string }) {
        this.buscarSubject.next(data);
      }
    

    getGuardarObservable() {
        return this.guardarSubject.asObservable();
    }

    getEditarObservable() {
        return this.editarSubject.asObservable();
    }

    getBuscarObservable(): Observable<{ tipo: string, valor: string }> {
        return this.buscarSubject.asObservable();
    }
}
