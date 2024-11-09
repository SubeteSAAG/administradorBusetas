import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { MessageModel } from '@models/message';
import { Usuario } from '@models/response-login';
import { BarraMenuService } from '@services/barra-menu-service';
import { LoadingService } from '@services/loading-service';
import { RecorridoService } from '@services/recorrido-service';
import { TokenService } from '@services/token-service';
import { LoadingComponent } from '@shared/loading/loading.component';
import { MessageComponent } from '@shared/message/message.component';
import { PRIMENG_MODULES } from 'app/primeng/primeng';

@Component({
  selector: 'app-gestion-recorrido',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    PRIMENG_MODULES,
    MessageComponent,
  ],
  templateUrl: './gestion-recorrido.component.html',
  styleUrl: './gestion-recorrido.component.scss'
})
export default class GestionRecorridoComponent implements OnInit{

  private readonly serviceRecorrido = inject(RecorridoService)
  private readonly serviceToken = inject(TokenService)
  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceBarraMenu = inject(BarraMenuService)


  ltsRecorridos = this.serviceRecorrido.ltsRecorridos

  enableLoading = false
  message!: MessageModel
  userLogged: Usuario | null = null;


  constructor(){
    this.getListRecorridos()
  }

  ngOnInit(): void {

    this.serviceBarraMenu.onPanelInformativo()
    this.userLogged = this.serviceToken.getDetailUser()
    this.serviceRecorrido.getLtsRecorridos()

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
      const response = this.ltsRecorridos()
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
