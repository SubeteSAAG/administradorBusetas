import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BusetaModel } from '@models/buseta';
import { UsuarioModel } from '@models/usuario'

type Entity = BusetaModel | UsuarioModel ; // Agrega más tipos según sea necesario

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
