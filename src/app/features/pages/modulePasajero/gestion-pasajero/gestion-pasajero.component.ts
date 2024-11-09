import { Component, effect, EventEmitter, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { LoadingService } from '@services/loading-service';
import { LoadingComponent } from '@shared/loading/loading.component'
import { MessageComponent } from '@shared/message/message.component'
import { MessageModel } from '@models/message';
import { PasajeroService } from '@services/pasajero-service';
import { AsignarPasajeroRutaModel, PasajeroListaModel, PasajeroModel } from '@models/pasajero';
import { BarraMenuService } from '@services/barra-menu-service';
import { RutaService } from '@services/ruta-service';
import { TokenService } from '@services/token-service';
import { Usuario } from '@models/response-login';
import { RutaBusetaModel, RutaModel } from '@models/ruta';
import { ApiResponse } from '@models/api-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';


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
  private readonly serviceBarraMenu = inject(BarraMenuService)
  private readonly serviceRuta = inject(RutaService)
  private readonly serviceToken = inject(TokenService)
  private readonly serviceConfirmation = inject(ConfirmationService)



  ltsPasajeros = this.servicePasajero.ltsPasajeros
  ltsRutaByBuseta = this.serviceRuta.ltsRutaByBuseta

  enableLoading = false
  sidebarVisible = false
  message!: MessageModel
  userLogged: Usuario | null = null;
  selectRuta!: RutaBusetaModel
  pasajeroId: number = 0


  constructor(){
    this.getListPasajeros()
  }

  ngOnInit(): void {

    this.serviceBarraMenu.onPanelInformativo()
    this.userLogged = this.serviceToken.getDetailUser()
    this.servicePasajero.getLtsPasajeros()
    this.serviceRuta.getLtsRutaBuseta(this.userLogged?.empresaId ?? 0)
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
          this.serviceLoading.hide()
        }
        if(response.statusCode != 200){
          this.serviceLoading.hide()
        }
      }
    });
  }

  openModal(pasajero: PasajeroListaModel){

    this.sidebarVisible = true
    this.pasajeroId = pasajero.id

  }

  recargarRutas(){
    this.serviceRuta.getLtsRutaBuseta(this.userLogged?.empresaId ?? 0)

  }

  agregarPasajeroRuta(){

    if(this.selectRuta){

      console.log('select ruta-->>>>>>')
      console.log(this.selectRuta)

      this.serviceLoading.show()
      const asignar: AsignarPasajeroRutaModel = {
        pasajeroId: this.pasajeroId,
        busetaRutaId: this.selectRuta.id ?? 0
      } 


      this.servicePasajero.asignarPasajeroRuta(asignar).subscribe({
        next: (response: ApiResponse) =>{
          if(response.statusCode == 200){
            this.message.description = "RUTA ASIGNADA CORRECTAMENTE"
            this.message.icon = "pi pi-car"
            this.message.title = "ASIGNACIÓN DE RUTA"
            this.message.colorIcon = "green"
            this.message.colorTitle= "green"
            this.message.visible = true
            this.serviceRuta.getLtsRutaBuseta(this.userLogged?.empresaId ?? 0)
            this.servicePasajero.getLtsPasajeros()
            this.sidebarVisible = false
          }else{
            this.serviceLoading.hide()
            this.message.description = response.message
            this.message.icon = "pi pi-times"
            this.message.title = "ERROR AL PROCESAR SOLICITUD"
            this.message.colorIcon = "red"
            this.message.colorTitle= "red"
            this.message.visible = true

          }
        },
        complete: () =>{
          this.serviceLoading.hide()

        },
        error: (error: HttpErrorResponse) => {
          this.serviceLoading.hide();
          let apiResponse: ApiResponse;
          try {
            apiResponse = error.error as ApiResponse; 
          } catch (e) {
            apiResponse = {
              success: false,
              statusCode: error.status,
              data: null,
              message: error.message,
              error: error.statusText
            };
          }
      
          this.message.description = apiResponse.message;
          this.message.icon = "pi pi-times";
          this.message.title = "ASIGNACIÓN DE RUTA";
          this.message.colorIcon = "red";
          this.message.colorTitle = "red";
          this.message.visible = true;
        }
      })



    }else{
      this.message.description = "TIENE QUE SELECCIONAR UNA RUTA"
      this.message.icon = "pi pi-info"
      this.message.title = "ADVERTENCIA"
      this.message.colorIcon = "blue"
      this.message.colorTitle= "blue"
      this.message.visible = true

    }


  }

  getRutaSelected(rutaSelect: RutaBusetaModel){

    this.selectRuta = rutaSelect
    const response = this.ltsRutaByBuseta();
    if (response && response.data) {
      response.data.forEach((ruta: RutaBusetaModel) => {
        ruta.selected = ruta === rutaSelect;
      });
    }
  }

  removeRutaPasajero(event: Event, pasajero: PasajeroModel){

    this.serviceConfirmation.confirm({
      target: event.target as EventTarget,
      message: 'Esta seguro de Quitar de la Ruta al Pasajero '+pasajero.informacionPersonal.nombres + ' ' +pasajero.informacionPersonal.apellidos + '?',
      header: 'Confirmación',
      icon: 'pi pi-check',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {

      },
      reject: () => {
      }
    });

  }

}
