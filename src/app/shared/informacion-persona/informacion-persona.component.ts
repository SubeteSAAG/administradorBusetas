import { Component, OnInit, inject } from '@angular/core';
import { BusetaModel } from '@models/buseta';
import { UsuarioModel } from '@models/usuario';
import { EntityService } from '@services/entity-service';
import { CommonModule } from '@angular/common';

enum EntityType {
  Buseta = 'Buseta',
  Persona = 'Persona',
  Empresa = 'Empresa'
}


@Component({
  selector: 'app-informacion-persona',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './informacion-persona.component.html',
  styleUrl: './informacion-persona.component.scss'
})
export class InformacionPersonaComponent implements OnInit{

  entity: any;
  entityType: EntityType = EntityType.Buseta; 

  private readonly serviceInfo = inject(EntityService)


  ngOnInit(): void {
    console.log("ingresa infor")
    this.serviceInfo.currentEntity$.subscribe(entity => {
      this.entity = entity;
      console.log("que entty")
      console.log(this.entity)
      this.entityType = this.determineEntityType(entity);
      console.log("mmmmmmmmmmm")
      console.log(this.entityType)
    });
  }

  determineEntityType(entity: any): EntityType {
    if (entity && 'propietario' in entity) {
      return EntityType.Buseta;
    }else if(entity && 'informacionPersonal' in entity){
      return EntityType.Persona;
    }else if(entity && 'ruc' in entity){
      return EntityType.Empresa;
    } 
    return EntityType.Buseta; // Ajusta el valor predeterminado según tus necesidades
  }


}
