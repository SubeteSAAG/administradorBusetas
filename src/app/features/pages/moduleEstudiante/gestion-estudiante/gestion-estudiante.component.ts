import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, OnInit } from '@angular/core';
import { ApiResponse } from '@models/api-response';
import { EstudianteModel } from '@models/estudiante';
import { MessageModel } from '@models/message';
import { AsignarPasajeroRutaModel } from '@models/pasajero';
import { Usuario } from '@models/response-login';
import { RutaModel } from '@models/ruta';
import { BarraMenuService } from '@services/barra-menu-service';
import { EstudianteService } from '@services/estudiante-service';
import { LoadingService } from '@services/loading-service';
import { PasajeroService } from '@services/pasajero-service';
import { RutaService } from '@services/ruta-service';
import { TokenService } from '@services/token-service';
import { LoadingComponent } from '@shared/loading/loading.component';
import { MessageComponent } from '@shared/message/message.component';
import { PRIMENG_MODULES } from 'app/primeng/primeng';

@Component({
  selector: 'app-gestion-estudiante',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    PRIMENG_MODULES,
    MessageComponent,

  ],
  templateUrl: './gestion-estudiante.component.html',
  styleUrl: './gestion-estudiante.component.scss'
})
export default class GestionEstudianteComponent implements OnInit{

  private readonly serviceEstudiante = inject(EstudianteService)
  private readonly serviceToken = inject(TokenService)
  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceBarraMenu = inject(BarraMenuService)
  private readonly serviceRuta = inject(RutaService)



  ltsEstudiantes = this.serviceEstudiante.ltsEstudiantes


  enableLoading = false
  message!: MessageModel
  userLogged: Usuario | null = null;

  ngOnInit(): void {

    this.serviceBarraMenu.onPanelInformativo()
    this.userLogged = this.serviceToken.getDetailUser()
    this.serviceEstudiante.getLtsEstuaintes()

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

  getListRecorridos(){
    this.serviceLoading.show()
    effect(() => {
      const response = this.ltsEstudiantes()
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



}

