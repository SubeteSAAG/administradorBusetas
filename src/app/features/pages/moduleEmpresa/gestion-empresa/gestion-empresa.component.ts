import { Component, effect, inject } from '@angular/core';
import { LoadingComponent } from '@shared/loading/loading.component';
import { MessageComponent } from '@shared/message/message.component';
import { PRIMENG_MODULES } from 'app/primeng/primeng';
import { CommonModule } from '@angular/common';
import { TokenService } from '@services/token-service';
import { LoadingService } from '@services/loading-service';
import { BarraMenuService } from '@services/barra-menu-service';
import { EmpresaService } from '@services/empresa-service';
import { MessageModel } from '@models/message';
import { Usuario } from '@models/response-login';

@Component({
  selector: 'app-gestion-empresa',
  standalone: true,
  imports: [
        CommonModule,
        LoadingComponent,
        PRIMENG_MODULES,
        MessageComponent,
  ],
  templateUrl: './gestion-empresa.component.html',
  styleUrl: './gestion-empresa.component.scss'
})
export default class GestionEmpresaComponent {

  private readonly serviceEmpresa = inject(EmpresaService)
  private readonly serviceToken = inject(TokenService)
  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceBarraMenu = inject(BarraMenuService)

  ltsEmpresas = this.serviceEmpresa.ltsEmpresas


  enableLoading = false
  message!: MessageModel
  userLogged: Usuario | null = null;
  
  constructor(){
    this.getListEmpresas()
  }

  ngOnInit(): void {

    this.serviceBarraMenu.onPanelInformativo()
    this.userLogged = this.serviceToken.getDetailUser()
    this.serviceEmpresa.getLtsEmpresas()

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

    getListEmpresas(){
      this.serviceLoading.show()
      effect(() => {
        const response = this.ltsEmpresas()
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
