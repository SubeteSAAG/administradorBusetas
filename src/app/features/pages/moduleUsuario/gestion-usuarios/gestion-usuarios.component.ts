import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { LoadingService } from '@services/loading-service';
import { LoadingComponent } from '@shared/loading/loading.component'
import { MessageComponent } from '@shared/message/message.component'
import { UsuarioService } from '@services/usuario-service';
import { BarraMenuService } from '@services/barra-menu-service';
import { MessageModel } from '@models/message';
import { UsuarioModel } from '@models/usuario';
import { ConfirmationService } from 'primeng/api';
import { ApiResponse } from '@models/api-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    PRIMENG_MODULES,
    MessageComponent,
  ],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.scss'
})
export default class GestionUsuariosComponent implements OnInit{

  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceUsuario = inject(UsuarioService)
  private readonly serviceBarraMenu = inject(BarraMenuService)
  private readonly serviceConfirmation = inject(ConfirmationService)


  ltsUsuariosConducotres = this.serviceUsuario.ltsUsuariosConducotres
  ltsUsuariosRepresentantes = this.serviceUsuario.ltsUsuariosRepresentantes

  enableLoading = false
  sidebarVisible = false
  message!: MessageModel

  constructor(){
  }

  ngOnInit(): void {
    this.serviceUsuario.getLtsUsuariosConducotres()
    this.serviceUsuario.getLtsUsuariosRepresentantes()
    this.serviceBarraMenu.onPanelInformativo()
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

  getListConductores(){
    this.serviceLoading.show()
    effect(() => {
      const response = this.ltsUsuariosConducotres()
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

  getListRepresentantes(){
    this.serviceLoading.show()
    effect(() => {
      const response = this.ltsUsuariosRepresentantes()
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

  recargar(){
    
  }

  ActiveDeactivate(event: Event,usuario: UsuarioModel, estado: number){

    console.log("mmmmmmmmmm")
    console.log(estado)

    if(estado == 1){
      this.serviceConfirmation.confirm({
        target: event.target as EventTarget,
        message: 'Esta seguro de Activar el Usuario?',
        header: 'Confirmación',
        icon: 'pi pi-check',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {

          this.serviceLoading.show()

          this.serviceUsuario.activarUsuario(usuario.usuario.id ?? 0).subscribe({
            next: (response: ApiResponse) =>{
              if(response.statusCode == 200){
                this.message.description = "USUARIO ACTIVADO"
                this.message.icon = "pi pi-user-plus"
                this.message.title = "ACTIVACIÓN DE USUARIOS"
                this.message.colorIcon = "green"
                this.message.colorTitle= "green"
                this.message.visible = true
                this.serviceUsuario.getLtsUsuariosConducotres()
                this.serviceUsuario.getLtsUsuariosRepresentantes()
    
              }else{
  
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
            error: (error: HttpErrorResponse) =>{

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
          
              this.message.description = apiResponse.message
              this.message.icon = "pi pi-times"
              this.message.title = "ACTIVACIÓN DE USUARIOS"
              this.message.colorIcon = "red"
              this.message.colorTitle= "red"
              this.message.visible = true
     
            }
          })
  

        },
        reject: () => {
        }
      });
  
    }else{
      this.serviceConfirmation.confirm({
        target: event.target as EventTarget,
        message: 'Esta seguro de Desactivar el Usuario?',
        header: 'Confirmación',
        icon: 'pi pi-times',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {

          this.serviceLoading.show()

          this.serviceUsuario.inactivarUsuario(usuario.usuario.id ?? 0).subscribe({
            next: (response: ApiResponse) =>{
              if(response.statusCode == 200){
                this.message.description = "USUARIO DESACTIVADO"
                this.message.icon = "pi pi-user-plus"
                this.message.title = "DESACTIVACIÓN DE USUARIOS"
                this.message.colorIcon = "green"
                this.message.colorTitle= "green"
                this.message.visible = true
                this.serviceUsuario.getLtsUsuariosConducotres()
                this.serviceUsuario.getLtsUsuariosRepresentantes()
    
              }else{
  
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
            error: (error: HttpErrorResponse) =>{
             
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

              this.message.description = apiResponse.message
              this.message.icon = "pi pi-times"
              this.message.title = "DESACTIVACIÓN DE USUARIOS"
              this.message.colorIcon = "red"
              this.message.colorTitle= "red"
              this.message.visible = true
     
            }
          })


        },
        reject: () => {
        }
      });

    }


  }

}
