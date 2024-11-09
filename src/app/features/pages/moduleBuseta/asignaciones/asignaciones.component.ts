import { Component, effect, EventEmitter, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignarBusetaEmpresaModel, AsignarBusetaRutaModel, BusetaModel } from '@models/buseta';
import { BusetaService } from '@services/buseta-service';
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { LoadingService } from '@services/loading-service';
import { LoadingComponent } from '@shared/loading/loading.component'
import { MessageComponent } from '@shared/message/message.component'
import { RutaService } from '@services/ruta-service';
import { hoarioModel, RutaModel } from '@models/ruta';
import { MessageModel } from '@models/message';
import { ApiResponse } from '@models/api-response';
import { HttpErrorResponse } from '@angular/common/http';
import { BarraMenuService } from '@services/barra-menu-service';
import { EmpresaService } from '@services/empresa-service';
import { EmpresaModel } from '@models/empresa';
import { TokenService } from '@services/token-service';
import { Usuario } from '@models/response-login';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { UsuarioService } from '@services/usuario-service';
import { ConductorModel } from '@models/conductor';


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
  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceRuta = inject(RutaService)
  private readonly serviceBarraMenu = inject(BarraMenuService)
  private readonly serviceEmpresa = inject(EmpresaService)
  private readonly serviceToken = inject(TokenService)
  private readonly serviceUsuario = inject(UsuarioService)


  ltsBusetas = this.serviceBuseta.ltsBusetas
  ltsRutasEmpresa = this.serviceRuta.ltsRutasEmpresa
  ltsRutasByBuseta = this.serviceRuta.ltsRutasByBuseta
  ltsPasajerosByRutaBuseta = this.serviceRuta.ltsPasajerosByRutaBuseta
  ltsEmpresas = this.serviceEmpresa.ltsEmpresas
  ltsUsuariosConducotres = this.serviceUsuario.ltsUsuariosConducotres

  selectRuta!: RutaModel
  selectEmpresa!: EmpresaModel
  enableLoading = false
  sidebarVisible = false
  message!: MessageModel
  busetaId: number = 0
  rutaId:  number = 0  
  empresaId: number = 0
  sidebarVisibleEmpresa: boolean = false
  userLogged: Usuario | null = null;
  isVisibleConductor = false
  searchConductor: any = null


  @ViewChild('stepperPanel') stepperPanel: any;


  constructor(){
    this.getListBusetas()
  }

  ngOnInit(): void {
    this.userLogged = this.serviceToken.getDetailUser()
    this.serviceBarraMenu.onPanelInformativo()
    this.serviceBuseta.getLtsBusetas()
    this.serviceRuta.getLtsRutaEmpresa(this.userLogged?.empresaId ?? 0)
    this.serviceEmpresa.getLtsEmpresas()
    this.serviceUsuario.getLtsUsuariosConducotres()

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


  getListBusetas(){
    this.serviceLoading.show()
    effect(() => {
      const response = this.ltsBusetas()
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


  recargar(){

  }

  recargarRutas(){
    this.serviceRuta.getLtsRutaBuseta(this.userLogged?.empresaId ?? 0)
  }

  recargarEmpresa(){
    this.serviceEmpresa.getLtsEmpresas()
  }

  getRutaSelected(rutaOption: RutaModel){

    this.selectRuta = rutaOption
    this.rutaId = rutaOption.id ?? 0
    const response = this.ltsRutasEmpresa();
    if (response && response.data) {
      response.data.forEach((ruta: RutaModel) => {
        ruta.selected = ruta === rutaOption;
      });
    }


  }
  
  getEmpresaSelected(empresaOption: EmpresaModel){

    this.selectEmpresa = empresaOption
    const response = this.ltsEmpresas();
    if (response && response.data) {
      response.data.forEach((empresa: EmpresaModel) => {
        empresa.selected = empresa === empresaOption;
      });
    }
  }

  getHorario(horarios: string): string | undefined {
    const horariosArray: hoarioModel[] = JSON.parse(horarios);

    let result = '';

    horariosArray.forEach((horario) => {
      const diaStr = horario.Dia !== undefined ? 'Dia ' + horario.Dia.toString() : '';
      const nombreDiaStr = horario.NombreDia !== undefined ? '' + horario.NombreDia : '';
      const horaSalidaStr = horario.HoraSalida !== undefined ? 'Salida ' + horario.HoraSalida.toString() : '';
      const horaLlegadaStr = horario.HoraLlegada !== undefined ? 'LLegada ' + horario.HoraLlegada.toString() : '';

        result += `${diaStr} ${nombreDiaStr} ${horaSalidaStr} ${horaLlegadaStr}\n`;
    });

    return result.trim();
  }

  agregarRuta(){

    if(this.selectRuta){

      this.serviceLoading.show()
      const asignar: AsignarBusetaRutaModel = {
        busetaId: this.busetaId,
        rutaId: this.rutaId
      } 


      this.serviceBuseta.asignarBusetaRuta(asignar).subscribe({
        next: (response: ApiResponse) =>{
          console.log("resssssss")
          console.log(response)
          if(response.statusCode == 200){
            this.message.description = "RUTA ASIGNADA CORRECTAMENTE"
            this.message.icon = "pi pi-car"
            this.message.title = "ASIGNACIÓN DE RUTA"
            this.message.colorIcon = "green"
            this.message.colorTitle= "green"
            this.message.visible = true
            this.serviceRuta.getLtsRutaBuseta(this.userLogged?.empresaId ?? 0)
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


  openModal(buseta: BusetaModel){
    this.busetaId = buseta.id ?? 0
    this.sidebarVisible = true
  }

  openModalEmpresa(buseta: BusetaModel){
    this.sidebarVisibleEmpresa = true
  }

  openModalVerConductor(buseta: BusetaModel){
    this.isVisibleConductor = true
    this.searchConductor = null
    const conductor = this.ltsUsuariosConducotres();
    if (conductor && conductor.data && conductor.data.length > 0) {
      this.searchConductor = conductor.data.find(
        (conductor: ConductorModel) =>
          conductor.id &&
          conductor.id.toString().toUpperCase() === buseta.conductorId?.toString().toUpperCase()
      );
    }
    
  }

  handleNextClick(nextCallback: EventEmitter<any>, buseta: BusetaModel) {
    console.log('Next button clicked');
    console.log(buseta.id)
    this.serviceRuta.getLtsRutasByBuseta(buseta.id ?? 0)
    
    nextCallback.emit();
  }

  handleNextClick2(nextCallback: EventEmitter<any>, ruta: any) {
    console.log('Next button clicked');
    this.serviceRuta.getLtsPasajerosByRutaBuseta(ruta.id)
    
    nextCallback.emit();
  }

  agregarEmpresa(){

    if(this.selectEmpresa){

      this.serviceLoading.show()
      const asignarEmpresa: AsignarBusetaEmpresaModel = {
        busetaId: this.busetaId,
        empresaId: this.selectEmpresa.id ?? 0
      } 


      this.serviceBuseta.asignarBusetaEmpresa(asignarEmpresa).subscribe({
        next: (response: ApiResponse) =>{
          if(response.statusCode == 200){
            this.message.description = "EMPRESA ASIGNADA CORRECTAMENTE"
            this.message.icon = "pi pi-car"
            this.message.title = "ASIGNACIÓN DE EMPRESA"
            this.message.colorIcon = "green"
            this.message.colorTitle= "green"
            this.message.visible = true
            this.serviceRuta.getLtsRutaBuseta(this.userLogged?.empresaId ?? 0)
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
          this.message.title = "ASIGNACIÓN DE EMPRESA";
          this.message.colorIcon = "red";
          this.message.colorTitle = "red";
          this.message.visible = true;
        }
      })



    }else{
      this.message.description = "TIENE QUE SELECCIONAR UNA EMPRESA"
      this.message.icon = "pi pi-info"
      this.message.title = "ADVERTENCIA"
      this.message.colorIcon = "blue"
      this.message.colorTitle= "blue"
      this.message.visible = true

    }
  }


}
