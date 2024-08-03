import { Component, OnInit, effect, inject } from '@angular/core';
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
import { PasajeroService } from '@services/pasajero-service';
import { PasajeroModel } from '@models/pasajero';
import { InformacionPersonalModel } from '@models/informacion-personal';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-pasajero',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingComponent,
    PRIMENG_MODULES,
    MessageComponent,
    ModalBusquedaComponent

  ],
  templateUrl: './pasajero.component.html',
  styleUrl: './pasajero.component.scss'
})
export default class PasajeroComponent implements OnInit {

  titulo = "Mantenimiento Pasajeros"
  enableLoading = false


  private guardarSubscription!: Subscription;
  private editarSubscription!: Subscription;
  private buscarSubscription!: Subscription;
  private searchSubscription!: Subscription;
  private readonly serviceEntity = inject(EntityService)
  private readonly serviceLoading = inject(LoadingService)
  private readonly servicePasajero = inject(PasajeroService)
  private readonly serviceSearch = inject(SearchService)

  usuarioForm!: FormGroup
  ltsPasajeros = this.servicePasajero.ltsPasajeros

  selectPasajero!: PasajeroModel
  listSearchPasajeros: PasajeroModel[] = []
  idPasajero: number = 0

  message!: MessageModel
  ref!: DynamicDialogRef;

  ltsTipoIdentificacion: any[] = [
    {
      idTipoIdentificacion: 1,
      nombre: "Cédula"
    },
      {
      idTipoIdentificacion: 2,
      nombre: "Pasaporte"
      }
  ]



  constructor (private serviceBarraMenu: BarraMenuService,
    private fb: FormBuilder,
    private dialogService: DialogService, 
){

  this.usuarioForm = this.fb.group(
    {
      nombres: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      sobreNombre: new FormControl('', [Validators.required]),
      tipoIdentificacion: new FormControl('', [Validators.required]),
      identificacion: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      celular: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]), 

    }
  )


  }

  ngOnInit(): void {

    this.guardarSubscription = this.serviceBarraMenu.getGuardarObservable().subscribe(() => {
      this.guardar();
    });

    this.editarSubscription = this.serviceBarraMenu.getEditarObservable().subscribe(() => {
      this.editar();
    });

    this.buscarSubscription = this.serviceBarraMenu.getBuscarObservable().subscribe(() => {
      this.buscar();
    });    

    this.servicePasajero.getLtsPasajeros()

    this.searchSubscription = this.serviceSearch.getSearchValueObservable().subscribe((value: any) => {
      console.log("llegagaga busqueueu")
      console.log(value)

      const pasajero = this.ltsPasajeros();
      if (pasajero && pasajero.data && pasajero.data.length > 0) {
        console.log('Buscando en la lista de busetas');
        this.listSearchPasajeros = pasajero.data.filter((pasajero: PasajeroModel) => pasajero.id && pasajero.id.toString().includes(value));
        console.log('Resultado de la búsqueda:', this.listSearchPasajeros);

        if(this.listSearchPasajeros.length == 1){
          this.serviceEntity.setEntity(this.listSearchPasajeros[0])
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

  validateForm(): boolean{
    let response = true
    if(this.usuarioForm.valid){
      response = true;
    }else{
      this.message.description = "FALTAN CAMPOS DE LLENAR!!!"
      this.message.icon = "pi pi-info"
      this.message.title = "ADVERTENCIA"
      this.message.colorIcon = "blue"
      this.message.colorTitle= "blue"
      this.message.visible = true
      this.usuarioForm.markAllAsTouched()
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

  guardar(){

    let valida = this.validateForm();
    if(valida){

      this.serviceLoading.show()
      const formValues =  this.usuarioForm.getRawValue();
      const fechaNacimiento = formValues.fechaNacimiento ? new Date(formValues.fechaNacimiento).toISOString() : null;

      const informacion: InformacionPersonalModel = {
        nombres: formValues.nombres,
        apellidos: formValues.apellidos,
        sobreNombre: formValues.sobreNombre,
        tipoIdentificacion: parseInt (formValues.tipoIdentificacion),
        identificacion:  formValues.identificacion,
        telefono:  formValues.telefono.toString(),
        celular: formValues.celular.toString(),
        fechaNacimiento: fechaNacimiento!.toString(),
        direccion: formValues.direccion
      }

      const pasajero: PasajeroModel = {
        informacionPersonal: informacion,
      } 

      this.servicePasajero.savePasajero(pasajero).subscribe({
        next: (response: ApiResponse) =>{
          console.log("resssssss")
          console.log(response)
          if(response.statusCode == 200){
            this.message.description = "PASAJERO CREADO!!!"
            this.message.icon = "pi pi-user-plus"
            this.message.title = "CREACIÓN DE PASAJEROS"
            this.message.colorIcon = "green"
            this.message.colorTitle= "green"
            this.message.visible = true

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
          this.usuarioForm.reset()
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
          this.message.title = "CREACIÓN DE PASAJEROS";
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
      const formValues =  this.usuarioForm.getRawValue();
      const fechaNacimiento = formValues.fechaNacimiento ? new Date(formValues.fechaNacimiento).toISOString() : null;

      const informacion: InformacionPersonalModel = {
        nombres: formValues.nombres,
        apellidos: formValues.apellidos,
        sobreNombre: formValues.sobreNombre,
        tipoIdentificacion: parseInt (formValues.tipoIdentificacion),
        identificacion:  formValues.identificacion,
        telefono:  formValues.telefono.toString(),
        celular: formValues.celular.toString(),
        fechaNacimiento: fechaNacimiento!.toString(),
        direccion: formValues.direccion
      }

      const pasajero: PasajeroModel = {
        id: this.idPasajero,
        informacionPersonal: informacion,
      } 

      this.servicePasajero.editPasajero(pasajero).subscribe({
        next: (response: ApiResponse) =>{
          console.log("resssssss")
          console.log(response)
          if(response.statusCode == 200){
            this.message.description = "PASAJERO CREADO!!!"
            this.message.icon = "pi pi-user-plus"
            this.message.title = "ACTUALIZACIÓN DE PASAJEROS"
            this.message.colorIcon = "green"
            this.message.colorTitle= "green"
            this.message.visible = true

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
          this.usuarioForm.reset()
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
          this.message.title = "ACTUALIZACIÓN DE PASAJEROS";
          this.message.colorIcon = "red";
          this.message.colorTitle = "red";
          this.message.visible = true;
        }
      })
    }


  }

  buscar(){

    this.ref = this.dialogService.open(ModalBusquedaComponent, {
      header: 'BUSCAR PASAJERO',
      width: '30%',
      data: {
        visible: true,
         content: '<p>Cédula: </p>'
      }
    });
    this.ref.onClose.subscribe((result: any) => {
      console.log("resullttt")
      console.log(result)
      if (result) {
        const response = this.ltsPasajeros()
        if (response && response.data) {
          response.data.forEach((pasajero: PasajeroModel) => {
            if(pasajero.id  == result){
              console.log("llelelalal")
              const date = new Date(pasajero.informacionPersonal.fechaNacimiento);
              const formattedDate = date.toISOString().split('T')[0];
              this.idPasajero = pasajero.id ?? 0
              this.usuarioForm.patchValue({
                nombres: pasajero.informacionPersonal.nombres,
                apellidos: pasajero.informacionPersonal.apellidos,
                sobreNombre: pasajero.informacionPersonal.sobreNombre,
                tipoIdentificacion: pasajero.informacionPersonal.tipoIdentificacion,
                identificacion: pasajero.informacionPersonal.identificacion,
                telefono: pasajero.informacionPersonal.telefono,
                celular: pasajero.informacionPersonal.celular,
                fechaNacimiento: formattedDate,
                direccion: pasajero.informacionPersonal.direccion, 
              });              
            }
          });
        }
    

      }
    });
  }

}
