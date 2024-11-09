import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '@shared/loading/loading.component'
import { ApiResponse } from '@models/api-response';
import { EntityService } from '@services/entity-service';
import { BarraMenuService } from '@services/barra-menu-service';
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { MessageComponent } from '@shared/message/message.component'
import { MessageModel } from '@models/message';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalBusquedaComponent} from '@shared/modal-busqueda/modal-busqueda.component'
import { SearchService } from '@services/search-service';
import { LoadingService } from '@services/loading-service';
import { HttpErrorResponse } from '@angular/common/http';
import { RutaService } from '@services/ruta-service';
import { hoarioModel, RutaModel } from '@models/ruta';
import { Usuario } from '@models/response-login';
import { TokenService } from '@services/token-service';

@Component({
  selector: 'app-ruta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingComponent,
    PRIMENG_MODULES,
    MessageComponent,
    ModalBusquedaComponent

  ],
  templateUrl: './ruta.component.html',
  styleUrl: './ruta.component.scss'
})
export default class RutaComponent implements OnInit{

  titulo = "Mantenimiento Rutas"
  enableLoading = false


  private guardarSubscription!: Subscription;
  private editarSubscription!: Subscription;
  private buscarSubscription!: Subscription;
  private searchSubscription!: Subscription;
  private readonly serviceEntity = inject(EntityService)
  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceRuta = inject(RutaService)
  private readonly serviceSearch = inject(SearchService)
  private readonly serviceToken = inject(TokenService)


  routeForm!: FormGroup
  horarioForm!: FormGroup
  idRoute: number = 0
  ltsRutaByBuseta = this.serviceRuta.ltsRutaByBuseta
  listSearchRouteEnterprise: RutaModel[] = []
  listHorarios: hoarioModel[] = []
  message!: MessageModel
  ref!: DynamicDialogRef;
  userLogged: Usuario | null = null;



  ltsDiasSemana: any[] = [
    { id_dia: 1, nombre: "Lunes" },
    { id_dia: 2, nombre: "Martes" },
    { id_dia: 2, nombre: "Miercoles" },
    { id_dia: 2, nombre: "Jueves" },
    { id_dia: 2, nombre: "Viernes" },
    { id_dia: 2, nombre: "Sáabado" },
    { id_dia: 2, nombre: "Domingo" },

  ];


  constructor (private serviceBarraMenu: BarraMenuService,
    private fb: FormBuilder,
    private dialogService: DialogService, 
  ){

    this.routeForm = this.fb.group(
      {
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
      }
    )

    this.horarioForm = this.fb.group(
      {
        dia: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
        nombreDia: new FormControl('', [Validators.required]),
        horaSalida: new FormControl('', [Validators.required]),
        horaLlegada: new FormControl('', [Validators.required]),
      }
    )


  }


  ngOnInit(): void {
    this.userLogged = this.serviceToken.getDetailUser()

    this.guardarSubscription = this.serviceBarraMenu.getGuardarObservable().subscribe(() => {
      this.guardar();
    });

    this.editarSubscription = this.serviceBarraMenu.getEditarObservable().subscribe(() => {
      this.editar();
    });

    this.buscarSubscription = this.serviceBarraMenu.getBuscarObservable().subscribe(() => {
      this.buscar();
    });    

    this.serviceRuta.getLtsRutaBuseta(this.userLogged?.empresaId ?? 0)

    this.searchSubscription = this.serviceSearch.getSearchValueObservable().subscribe((value: any) => {
      console.log("llegagaga busqueueu")
      console.log(value)

      const ruta = this.ltsRutaByBuseta();
      console.log("rutas")
      console.log(ruta.data)
      if (ruta && ruta.data && ruta.data.length > 0) {
        console.log('Buscando en la lista de busetas');
        this.listSearchRouteEnterprise = ruta.data.filter((ruta: RutaModel) => ruta.name.toString().toUpperCase() == value.toString().toUpperCase());
        console.log('Resultado de la búsqueda:', this.listSearchRouteEnterprise);

        if(this.listSearchRouteEnterprise.length == 1){
          this.serviceEntity.setEntity(this.listSearchRouteEnterprise[0])
        }
      }
    });

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


  ngOnDestroy() {

    if(this.guardarSubscription){
      this.guardarSubscription.unsubscribe();
    }
    if(this.editarSubscription){
      this.editarSubscription.unsubscribe();
    }
    if(this.buscarSubscription){
      this.buscarSubscription.unsubscribe();
    }
    if(this.searchSubscription){
      this.searchSubscription.unsubscribe();
    }
  }

  onSubmit(){
    this.validateForm()
  }

  onSubmit2(){
    this.validateFormHorario()
  }

  validateForm(): boolean{
    let response = true
    if(this.routeForm.valid){
      response = true;
    }else{
      this.message.description = "FALTAN CAMPOS DE LLENAR!!!"
      this.message.icon = "pi pi-info"
      this.message.title = "ADVERTENCIA"
      this.message.colorIcon = "blue"
      this.message.colorTitle= "blue"
      this.message.visible = true
      this.routeForm.markAllAsTouched()
      response = false;
    }
    return response
  }

  validateFormHorario(): boolean{
    let response = true
    if(this.horarioForm.valid){
      response = true;
    }else{
      this.message.description = "FALTAN CAMPOS DE LLENAR!!!"
      this.message.icon = "pi pi-info"
      this.message.title = "ADVERTENCIA"
      this.message.colorIcon = "blue"
      this.message.colorTitle= "blue"
      this.message.visible = true
      this.routeForm.markAllAsTouched()
      response = false;
    }
    return response
  }


  handleMessageClosed() {
    this.message.description = ""
    this.message.icon = ""
    this.message.title = ""
    this.message.colorIcon = ""
    this.message.colorTitle = ""
    this.message.visible = false

  }


  addHorarioRuta(){

    let valida = this.validateFormHorario();
    if(valida){
      const formValuesHorario =  this.horarioForm.getRawValue();
      //const codigo = Math.floor(100000 + Math.random() * 900000);

      if(this.listHorarios.length>0){
        const index = this.listHorarios.findIndex(item => item.dia == formValuesHorario.dia)
        console.log("indexxx")
        console.log(index)
        if(index != -1){
          this.message.description = "EL DIA SELECCIONADO YA FUE AGREGADO!!!"
          this.message.icon = "pi pi-info"
          this.message.title = "ADVERTENCIA"
          this.message.colorIcon = "blue"
          this.message.colorTitle= "blue"
          this.message.visible = true
          return
        }
      }
        

      const horario: hoarioModel = {
        dia: formValuesHorario.dia,
        horaLlegada: parseFloat(formValuesHorario.horaLlegada.replace(':','.')),
        horaSalida: parseFloat(formValuesHorario.horaSalida.replace(':','.')),
        nombreDia: formValuesHorario.nombreDia
      }
      this.listHorarios = [... this.listHorarios, horario]
    }
  }

  quitarItemHora(horario: hoarioModel){
    console.log("horario select")
    console.log(horario)
    this.listHorarios = this.listHorarios.filter((item) => item.dia !== horario.dia || item.Dia !== horario.Dia); 
  }

  getDia(horario: hoarioModel): number | undefined {
    return horario.dia !== undefined  ? horario.dia : horario.Dia;
  }


  getNombreDia(horario: hoarioModel): string | undefined {
    return horario.nombreDia !== undefined ? horario.nombreDia : horario.NombreDia;
  }

  getHoraSalida(horario: hoarioModel): number | undefined {
    return horario.horaSalida !== undefined ? horario.horaSalida : horario.HoraSalida;
  }

  getHoraLlegada(horario: hoarioModel): number | undefined {
    return horario.horaLlegada !== undefined ? horario.horaLlegada : horario.HoraLlegada;
  }




  guardar(){

    let valida = this.validateForm();
    if(valida){

      this.serviceLoading.show()
      const formValues =  this.routeForm.getRawValue();

      const route: RutaModel = {
        name: formValues.name,
        description: formValues.description,
        horario: this.listHorarios

      }


      this.serviceRuta.saveRoute(route).subscribe({
        next: (response: ApiResponse) =>{
          console.log("resssssss")
          console.log(response)
          if(response.statusCode == 200){
            this.message.description = "RUTA CREADA!!!"
            this.message.icon = "pi pi-user-plus"
            this.message.title = "CREACIÓN DE RUTAS"
            this.message.colorIcon = "green"
            this.message.colorTitle= "green"
            this.message.visible = true
            this.serviceRuta.getLtsRutaBuseta(this.userLogged?.empresaId ?? 0)

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
          this.clear()
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
          this.message.title = "CREACIÓN DE RUTAS";
          this.message.colorIcon = "red";
          this.message.colorTitle = "red";
          this.message.visible = true;
        }
      })
    }


  }

  editar(){

    let valida = this.validateForm();
    if(valida){

      this.serviceLoading.show()
      const formValues =  this.routeForm.getRawValue();

      const route: RutaModel = {
        id: this.idRoute,
        name: formValues.name,
        description: formValues.description,
        horario: this.listHorarios

      }


      this.serviceRuta.editRoute(route).subscribe({
        next: (response: ApiResponse) =>{
          console.log("resssssss")
          console.log(response)
          if(response.statusCode == 200){
            this.message.description = "RUTA ACTUALIZADA!!!"
            this.message.icon = "pi pi-user-plus"
            this.message.title = "CREACIÓN DE RUTAS"
            this.message.colorIcon = "green"
            this.message.colorTitle= "green"
            this.message.visible = true
            this.serviceRuta.getLtsRutaBuseta(this.userLogged?.empresaId ?? 0)
            this.serviceEntity.setEntity(response.data)
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
          this.message.title = "ACTUALIZACIÓN DE RUTAS";
          this.message.colorIcon = "red";
          this.message.colorTitle = "red";
          this.message.visible = true;
        }
      })
    }


  }

  buscar(){

    this.clear()
    
    this.ref = this.dialogService.open(ModalBusquedaComponent, {
      header: 'BUSCAR RUTA',
      width: '30%',
      data: {
        visible: true,
         content: '<p>Nombre Ruta: </p>'
      }
    });
    this.ref.onClose.subscribe((result: any) => {
      console.log("resullttt")
      console.log(result)
      if (result) {
        let resultFound = false
        const response = this.ltsRutaByBuseta()
        if (response && response.data) {
          response.data.forEach((ruta: RutaModel) => {
            if(ruta.name.toUpperCase()  == result.toUpperCase()){
              console.log("llelelalal")
              console.log(ruta)

              this.idRoute = ruta.id ?? 0
              this.routeForm.patchValue({
                name: ruta.name,
                description: ruta.description,
              });   
              if(ruta.horario){
                
                if (typeof ruta.horario === 'string') {
                  this.listHorarios = JSON.parse(ruta.horario);
                }
                
              }
              
              resultFound = true

            }
          });
          if(!resultFound){
            this.serviceEntity.setEntity(this.listSearchRouteEnterprise[0])
            this.message.description = "NO SE ENCONTRO LA RUTA"
            this.message.icon = "pi pi-info"
            this.message.title = "ADVERTENCIA"
            this.message.colorIcon = "blue"
            this.message.colorTitle= "blue"
            this.message.visible = true
          }
        }
    

      }
    });
  }

  clear(){
    this.listHorarios = []
    this.listSearchRouteEnterprise = []
    this.horarioForm.reset()
    this.routeForm.reset()
    this.serviceEntity.setEntity(this.listSearchRouteEnterprise[0])

  }

}