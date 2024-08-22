// busqueda.service.ts

import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarraMenuService {
    
    private guardarSubject = new Subject<void>();
    private editarSubject = new Subject<void>();
    private buscarSubject = new Subject<void>();
    private panelInformativoSubject = new Subject<void>();

    onGuardar() {
        this.guardarSubject.next();
    }

    onEditar() {
        this.editarSubject.next();
    }

    onBuscar() {
        this.buscarSubject.next();
    }

    onPanelInformativo(){
        this.panelInformativoSubject.next();
    }
    

    getGuardarObservable() {
        return this.guardarSubject.asObservable();
    }

    getEditarObservable() {
        return this.editarSubject.asObservable();
    }

    getBuscarObservable() {
        return this.buscarSubject.asObservable();
    }

    getPanelInformativoObservable(){
        return this.panelInformativoSubject.asObservable();
    }
}
