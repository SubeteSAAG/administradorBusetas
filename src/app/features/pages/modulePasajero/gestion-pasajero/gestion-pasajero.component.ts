import { Component, effect, EventEmitter, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { LoadingService } from '@services/loading-service';
import { LoadingComponent } from '@shared/loading/loading.component'
import { MessageComponent } from '@shared/message/message.component'
import { MessageModel } from '@models/message';
import { ApiResponse } from '@models/api-response';
import { HttpErrorResponse } from '@angular/common/http';
import { PasajeroService } from '@services/pasajero-service';
import { PasajeroListaModel, PasajeroModel } from '@models/pasajero';


@Component({
  selector: 'app-gestion-pasajero',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    PRIMENG_MODULES,
    MessageComponent,
  ],
  templateUrl: './gestion-pasajero.component.html',
  styleUrl: './gestion-pasajero.component.scss'
})
export default class GestionPasajeroComponent implements OnInit{

  private readonly serviceLoading = inject(LoadingService)
  private readonly servicePasajero = inject(PasajeroService)


  ltsPasajeros = this.servicePasajero.ltsPasajeros

  enableLoading = false
  sidebarVisible = false
  message!: MessageModel

  constructor(){
    this.getListPasajeros()
  }

  ngOnInit(): void {
    this.servicePasajero.getLtsPasajeros()
    this.serviceLoading.loading$.subscribe((isLoading) => {
      this.enableLoading = isLoading;
    });
    this.message = {
      title: '',
      colorTitle: '',
      description: '',
      icon: '',
      colorIcon: '',
      visible: false
    };

  }

  handleMessageClosed() {
    this.message.description = ""
    this.message.icon = ""
    this.message.title = ""
    this.message.colorIcon = ""
    this.message.colorTitle = ""
    this.message.visible = false

  }

  getListPasajeros(){
    this.serviceLoading.show()
    effect(() => {
      const response = this.ltsPasajeros()
      if (response && response.data != null) {
        if(response.statusCode === 200){
          console.log("verifica")
          this.serviceLoading.hide()
        }
        if(response.statusCode != 200){
          this.serviceLoading.hide()
        }
      }
    });
  }

  openModal(pasajero: PasajeroListaModel){
    

  }



}
