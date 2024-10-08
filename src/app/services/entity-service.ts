import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BusetaModel } from '@models/buseta';
import { UsuarioModel } from '@models/usuario'
import { PasajeroModel } from '@models/pasajero';
import { EstudianteModel } from '@models/estudiante';
import { RutaModel } from '@models/ruta';
import { EmpresaModel } from '@models/empresa';

type Entity = BusetaModel | UsuarioModel | PasajeroModel | EstudianteModel | RutaModel | EmpresaModel ; 

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  private currentEntity = new BehaviorSubject<Entity | null>(null);
  currentEntity$ = this.currentEntity.asObservable();

  setEntity(entity: Entity) {
    console.log("llega entoty")
    console.log(entity)
    this.currentEntity.next(entity);
  }
}
