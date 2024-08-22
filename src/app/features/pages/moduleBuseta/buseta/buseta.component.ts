import { Component, OnInit, effect, inject } from '@angular/core';
import { BusetaService } from '@services/buseta-service';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BarraMenuService } from '@services/barra-menu-service';
import { LoadingService } from '@services/loading-service';
import { BusetaModel } from '@models/buseta';
import { LoadingComponent } from '@shared/loading/loading.component'
import { ApiResponse } from '@models/api-response';
import { EntityService } from '@services/entity-service';
import { UsuarioService } from '@services/usuario-service';
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { ResponseUsuario, UsuarioModel } from '@models/usuario';
import { MessageComponent } from '@shared/message/message.component'
import { MessageModel } from '@models/message';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalBusquedaComponent} from '@shared/modal-busqueda/modal-busqueda.component'
import { SearchService } from '@services/search-service';
import { HttpErrorResponse } from '@angular/common/http';
import { UppercaseDirective } from '@utils/uppercase.directive'

@Component({
  selector: 'app-buseta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingComponent,
    PRIMENG_MODULES,
    MessageComponent,
    ModalBusquedaComponent,
    UppercaseDirective
  ],
  
  templateUrl: './buseta.component.html',
  styleUrl: './buseta.component.scss'
})
export default class BusetaComponent implements OnInit {

  titulo = "Mantenimiento Buseta"
  enableLoading = false

  private guardarSubscription!: Subscription;
  private editarSubscription!: Subscription;
  private buscarSubscription!: Subscription;
  private searchSubscription!: Subscription;
  private readonly serviceEntity = inject(EntityService)
  private readonly serviceUsuario = inject(UsuarioService)
  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceBuseta = inject(BusetaService)
  private readonly serviceSearch = inject(SearchService)
 

  busetaForm!: FormGroup


  ltsUserConducotres = this.serviceUsuario.ltsUsuariosConducotres
  ltsBusetas = this.serviceBuseta.ltsBusetas

  selectConductor!: ResponseUsuario
  listSearchBusetas: BusetaModel[] = []
  idVehiculo: number = 0

  message!: MessageModel

  ref!: DynamicDialogRef;


  constructor(
    private serviceBarraMenu: BarraMenuService,
    private fb: FormBuilder,
    private dialogService: DialogService, 
  ) {


    this.verificaListaUsuarioConductor();


    this.busetaForm = this.fb.group(
      {
        nombre: new FormControl('', [Validators.required]),
        placa: new FormControl('', [Validators.required]),
        descripcion: new FormControl('', [Validators.required]),
        propietario: null,
        capacidad: new FormControl('', [Validators.required]),
      }
    )

  
  }



  ngOnInit() {

    this.serviceBarraMenu.onPanelInformativo()

    
    this.guardarSubscription = this.serviceBarraMenu.getGuardarObservable().subscribe(() => {
      this.guardar();
    });

    this.editarSubscription = this.serviceBarraMenu.getEditarObservable().subscribe(() => {
      this.editar();
    });

    this.buscarSubscription = this.serviceBarraMenu.getBuscarObservable().subscribe(() => {
      this.buscar();
    });    


    this.searchSubscription = this.serviceSearch.getSearchValueObservable().subscribe((value: any) => {
      console.log("llegagaga busqueueu")
      console.log(value)

      const busetas = this.ltsBusetas();
      if (busetas && busetas.data && busetas.data.length > 0) {
        console.log('Buscando en la lista de busetas');
        this.listSearchBusetas = busetas.data.filter((buseta: BusetaModel) => buseta.placa && buseta.placa.toString().toUpperCase() === value.toUpperCase() || buseta.id?.toString().toUpperCase() === (value.toUpperCase())) ;
        console.log('Resultado de la búsqueda:', this.listSearchBusetas);



        if(this.listSearchBusetas.length == 1){
          this.serviceEntity.setEntity(this.listSearchBusetas[0])
        }
        

      }

    });


    this.serviceLoading.loading$.subscribe((isLoading) => {
      this.enableLoading = isLoading;
    });


    this.serviceUsuario.getLtsUsuariosConducotres()
    this.serviceBuseta.getLtsBusetas()

    this.message = {
      title: '',
      colorTitle: '',
      description: '',
      icon: '',
      colorIcon: '',
      visible: false
    };
    
  }

  verificaListaUsuarioConductor() {
    this.serviceLoading.show()
    effect(() => {
      const response = this.ltsUserConducotres();
      console.log("veirifiaccaca")
      console.log(response)
      if (response && response.data != null) {
        console.log("verifica")
        console.log(response)
        this.serviceLoading.hide()
      }
    });
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

  validateForm(): boolean{
    let response = true
    if(this.busetaForm.valid){
      response = true;
    }else{
      this.message.description = "FALTAN CAMPOS DE LLENAR!!!"
      this.message.icon = "pi pi-info"
      this.message.title = "ADVERTENCIA"
      this.message.colorIcon = "blue"
      this.message.colorTitle= "blue"
      this.message.visible = true
      this.busetaForm.markAllAsTouched()
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

  recargar(){
    console.log("recarga")
    this.serviceUsuario.getLtsUsuariosConducotres()
  }
  

  getCondcutor(conductor: ResponseUsuario){

    console.log("condufud")
    console.log(conductor)
    this.selectConductor = conductor;
    this.deselectOthers(conductor);
  }

  deselectOthers(selectedConductor: ResponseUsuario) {
    const response = this.ltsUserConducotres();
    console.log("siiiiiiiiiiiiiiiii")
    console.log(response)
    if (response && response.data) {
      response.data.forEach((conductor: ResponseUsuario) => {
        conductor.selected = conductor === selectedConductor;
      });
    }
  }

  private guardar() {

    console.log("clciicici")
    let valida = this.validateForm();
    if(valida){
      //const formData = this.busetaForm.value;

      if(!this.selectConductor){
        
        console.log("no seset values")
        this.message.description = "TIENE QUE SELECCIONAR UN CONDUCTOR!!!"
        this.message.icon = "pi pi-info"
        this.message.title = "ADVERTENCIA"
        this.message.colorIcon = "blue"
        this.message.colorTitle= "blue"
        this.message.visible = true
        return


      }
      const formValues =  this.busetaForm.getRawValue();
      const buseta: BusetaModel = {
        capacidad: formValues.capacidad,
        description: formValues.descripcion,
        propietario: formValues.propietario,
        name: formValues.nombre,
        placa: formValues.placa,
        conductorId: this.selectConductor.id
      } 

      this.serviceLoading.show()

      this.serviceBuseta.saveBuseta(buseta).subscribe({
        next: (response: ApiResponse) =>{
          console.log("resssssss")
          console.log(response)
          if(response.statusCode == 200){
            this.message.description = "BUSETA AGREGADA CORRECTAMENTE!!!"
            this.message.icon = "pi pi-car"
            this.message.title = "CREACIÓN DE VEHICULO"
            this.message.colorIcon = "green"
            this.message.colorTitle= "green"
            this.message.visible = true
            this.serviceBuseta.getLtsBusetas()
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
          this.message.title = "CREACIÓN DE VEHICULO";
          this.message.colorIcon = "red";
          this.message.colorTitle = "red";
          this.message.visible = true;
        }
      })
    }

  }

  private editar() {

    let valida = this.validateForm();
    if(valida){

      if(!this.selectConductor){
        this.message.description = "TIENE QUE SELECCIONAR UN CONDUCTOR!!!"
        this.message.icon = "pi pi-info"
        this.message.title = "ADVERTENCIA"
        this.message.colorIcon = "blue"
        this.message.colorTitle= "blue"
        this.message.visible = true
        return
      }
      const formValues =  this.busetaForm.getRawValue();
      const buseta: BusetaModel = {
        id: this.idVehiculo,
        capacidad: formValues.capacidad,
        description: formValues.descripcion,
        propietario: formValues.propietario,
        name: formValues.nombre,
        placa: formValues.placa,
  
      } 

      this.serviceLoading.show()

      this.serviceBuseta.editBuseta(buseta).subscribe({
        next: (response: ApiResponse) =>{
          console.log("resssssss")
          console.log(response)
          if(response.statusCode == 200){
            this.message.description = "BUSETA ACTUALIZADA CORRECTAMENTE!!!"
            this.message.icon = "pi pi-car"
            this.message.title = "ACTUALIZACIÓN DE VEHICULO"
            this.message.colorIcon = "green"
            this.message.colorTitle= "green"
            this.message.visible = true
            this.serviceBuseta.getLtsBusetas()
            this.serviceEntity.setEntity(response.data)


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
          this.message.title = "ACTUALIZACIÓN DE VEHICULO";
          this.message.colorIcon = "red";
          this.message.colorTitle = "red";
          this.message.visible = true;
        }
      })
    }

    
  }

  private buscar(){

    this.clear()

    this.ref = this.dialogService.open(ModalBusquedaComponent, {
      header: 'BUSCAR VEHICULO',
      width: '30%',
      data: {
        visible: true,
         content: '<p>Placa: </p>'
      }
    });

    this.ref.onClose.subscribe((result: any) => {
      console.log("cerarar")
      console.log(result)
      if (result) {
        console.log("accion el cerrar")
        let resultFound = false
        const response = this.ltsBusetas()
        if (response && response.data) {
          response.data.forEach((buseta: BusetaModel) => {
            if(buseta.placa.toUpperCase() === result.toUpperCase() || buseta.id == result){
              console.log("llelelalal")
              const conductorEncontrado = this.ltsUserConducotres().data.find((conductor: ResponseUsuario) => conductor.id == buseta.conductorId)
              if(conductorEncontrado){
                conductorEncontrado.selected = true
                this.selectConductor = conductorEncontrado
              }
              this.idVehiculo = buseta.id || 0
              this.busetaForm.patchValue({
                nombre: buseta.name,
                descripcion: buseta.description,
                propietario: "",
                capacidad: buseta.capacidad,
                placa: buseta.placa
              }); 
                  
              resultFound = true
            }
          });
          if(!resultFound){
            this.serviceEntity.setEntity(this.listSearchBusetas[0])
            this.message.description = "NO SE ENCONTRO LA PLACA INGRESADA"
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
    const response = this.ltsUserConducotres();
    if (response && response.data) {
      response.data.forEach((conductor: ResponseUsuario) => {
        conductor.selected = false;
      });
    }
    this.listSearchBusetas = []
    this.busetaForm.reset()
    this.serviceEntity.setEntity(this.listSearchBusetas[0])

  }


}
