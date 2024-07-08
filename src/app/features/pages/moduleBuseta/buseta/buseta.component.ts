import { Component, OnInit, effect, inject } from '@angular/core';
import { BusetaService } from '@services/buseta-service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BarraMenuService } from '@services/barra-menu-service';
import { LoadingService } from '@services/loading-service';
import { BusetaModel } from '@models/buseta';
import { LoadingComponent } from '@shared/loading/loading.component'
import { ApiResponse } from '@models/api-response';
import { EntityService } from '@services/entity-service';
import { UsuarioService } from '@services/usuario-service';
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { ResponseUsuario } from '@models/usuario';
import { MessageComponent } from '@shared/message/message.component'
import { MessageModel } from '@models/message';


@Component({
  selector: 'app-buseta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingComponent,
    PRIMENG_MODULES,
    MessageComponent
  ],
  templateUrl: './buseta.component.html',
  styleUrl: './buseta.component.scss'
})
export default class BusetaComponent implements OnInit {

  titulo = "Mantenimiento Buseta"
  enableLoading = false

  private guardarSubscription!: Subscription;
  private editarSubscription!: Subscription;
  private readonly serviceEntity = inject(EntityService)
  private readonly serviceUsuario = inject(UsuarioService)
  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceBuseta = inject(BusetaService)
 

  busetaForm!: FormGroup

  ltsBusetas = this.serviceBuseta.ltsBusetas

  buseta: BusetaModel = {
    capacidad: 10,
    description: "Buseta 1",
    propietario: "Juan",
    name: "cris",
    conductorId: 1
  }

  ltsUserConducotres = this.serviceUsuario.ltsUsuariosConducotres
  selectConductor!: ResponseUsuario

  message!: MessageModel


  constructor(
    private serviceBarraMenu: BarraMenuService,
    private fb: FormBuilder
  ) {


    this.verificaListaUsuarioConductor();


    this.busetaForm = this.fb.group(
      {
        nombre: new FormControl('', [Validators.required]),
        descripcion: new FormControl('', [Validators.required]),
        propietario: new FormControl('', [Validators.required]),
        capacidad: new FormControl('', [Validators.required]),
      }
    )

  
  }



  ngOnInit() {

    
    this.guardarSubscription = this.serviceBarraMenu.getGuardarObservable().subscribe(() => {
      this.guardar();
    });

    this.editarSubscription = this.serviceBarraMenu.getEditarObservable().subscribe(() => {
      this.editar();
    });

    this.serviceLoading.loading$.subscribe((isLoading) => {
      this.enableLoading = isLoading;
    });

    this.serviceEntity.setEntity(this.buseta)

    this.serviceUsuario.getLtsUsuariosConducotres()

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
      if (response) {
        this.serviceLoading.hide()

      }
    });
  }

  ngOnDestroy() {
    this.guardarSubscription.unsubscribe();
    this.editarSubscription.unsubscribe();
  }

  onSubmit(){
    this.validateForm()
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
          const response = this.ltsUserConducotres();
          if (response && response.data) {
            response.data.forEach((conductor: ResponseUsuario) => {
              conductor.selected = false;
            });
          }
          this.busetaForm.reset()
          this.serviceLoading.hide()

        },
        error: (error: any) =>{
          this.serviceLoading.hide()
          this.message.description = ""+error.message
          this.message.icon = "pi pi-times"
          this.message.title = "CREACIÓN DE VEHICULO"
          this.message.colorIcon = "red"
          this.message.colorTitle= "red"
          this.message.visible = true

        }
      })
    }

  }

  private editar() {

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


}
