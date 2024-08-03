import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusetaModel } from '@models/buseta';
import { BusetaService } from '@services/buseta-service';
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { LoadingService } from '@services/loading-service';
import { LoadingComponent } from '@shared/loading/loading.component'
import { ApiResponse } from '@models/api-response';
import { MessageComponent } from '@shared/message/message.component'

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    PRIMENG_MODULES,
    MessageComponent,

  ],
  templateUrl: './asignaciones.component.html',
  styleUrl: './asignaciones.component.scss'
})
export default class AsignacionesComponent implements OnInit{

  private readonly serviceBuseta = inject(BusetaService)

  ltsBusetas = this.serviceBuseta.ltsBusetas

  ngOnInit(): void {
  
    this.serviceBuseta.getLtsBusetas()
  }


  recargar(){

  }

  openModal(buseta: BusetaModel){

  }


}
