import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validator, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { MessageComponent } from '@shared/message/message.component'
import { MessageModel } from '@models/message';
import { BarraMenuService } from '@services/barra-menu-service'
import { LoadingComponent } from '@shared/loading/loading.component'
import { LoadingService } from '@services/loading-service';
import { EntityService } from '@services/entity-service';
import { UsuarioService } from '@services/usuario-service';
import { ResponseUsuario } from '@models/usuario';
import { EstudianteModel } from '@models/estudiante';
import { InformacionPersonalModel } from '@models/informacion-personal';
import { EstudianteService } from '@services/estudiante-service';
import { error } from 'console';
import { ApiResponse } from '@models/api-response';


@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PRIMENG_MODULES,
    MessageComponent,
    LoadingComponent
  ],
  templateUrl: './estudiante.component.html',
  styleUrl: './estudiante.component.scss'
})
export default class EstudianteComponent implements OnInit, OnDestroy {

  titulo = "Mantenimiento Estudiantes"

  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceUsuario = inject(UsuarioService)
  private readonly serviceEntity = inject(EntityService)
  private readonly serviceEstudent = inject(EstudianteService)


  private guardarSubscription!: Subscription;
  private editarSubscription!: Subscription;

  estudianteForm!: FormGroup
  message!: MessageModel
  enableLoading = false
  selectRepresentante!: ResponseUsuario


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

  ltsUserRepresentantes = this.serviceUsuario.ltsUsuariosRepresentantes


  constructor(private serviceBarraMenu: BarraMenuService,
    private fb: FormBuilder){

      this.verificaListaUsuarioRepresentante()

      this.estudianteForm = this.fb.group(
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
  
      this.message = {
        title: '',
        colorTitle: '',
        description: '',
        icon: '',
        colorIcon: '',
        visible: false
      };
  

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

    this.serviceUsuario.getLtsUsuariosRepresentantes()

  }

  ngOnDestroy() {
    this.guardarSubscription.unsubscribe();
    this.editarSubscription.unsubscribe();
  }

  verificaListaUsuarioRepresentante() {
    this.serviceLoading.show()
    effect(() => {
      const response = this.ltsUserRepresentantes();
      if (response) {
        this.serviceLoading.hide()

      }
    });
  }


  validateForm(): boolean{
    let response = true
    if(this.estudianteForm.valid){
      response = true;
    }else{
      this.message.description = "FALTAN CAMPOS DE LLENAR!!!"
      this.message.icon = "pi pi-info"
      this.message.title = "ADVERTENCIA"
      this.message.colorIcon = "blue"
      this.message.colorTitle= "blue"
      this.message.visible = true
      this.estudianteForm.markAllAsTouched()
      response = false;
    }
    return response
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
    this.serviceUsuario.getLtsUsuariosRepresentantes()
  }


  deselectOthers(selectRepresentante: ResponseUsuario) {
    const response = this.ltsUserRepresentantes();
    if (response && response.data) {
      response.data.forEach((representante: ResponseUsuario) => {
        representante.selected = representante === selectRepresentante;
      });
    }
  }

  getRepresentante(representante: ResponseUsuario){

    this.selectRepresentante = representante;
    this.deselectOthers(representante);
  }


  private guardar() {

    let valida = this.validateForm();
    if(valida){
      //const formData = this.busetaForm.value;

      if(!this.selectRepresentante){
        
        this.message.description = "TIENE QUE SELECCIONAR UN REPRESENTANTE!!!"
        this.message.icon = "pi pi-info"
        this.message.title = "ADVERTENCIA"
        this.message.colorIcon = "blue"
        this.message.colorTitle= "blue"
        this.message.visible = true
        return
      }

      const formValues =  this.estudianteForm.getRawValue();
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


      const estudiante: EstudianteModel = {
        infoPersonal: informacion,
        representanteId: this.selectRepresentante.id
      } 

      this.serviceLoading.show()


      this.serviceEstudent.saveEstudent(estudiante).subscribe({
        next: (response: ApiResponse) => {
          console.log(response)
          if(response.statusCode == 200){
            this.message.description = "ESTUDINATE CREADO CORRECTAMENTE!!!"
            this.message.icon = "pi pi-user"
            this.message.title = "CREACIÓN DE ESTUDIANTE"
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
        complete: () => {
          const response = this.ltsUserRepresentantes();
          if (response && response.data) {
            response.data.forEach((representante: ResponseUsuario) => {
              representante.selected = false;
            });
          }
          this.estudianteForm.reset()
          this.serviceLoading.hide()

        },
        error: (error) =>{
          this.serviceLoading.hide()
          this.message.description = ""+error.message
          this.message.icon = "pi pi-times"
          this.message.title = "CREACIÓN DE ESTUDIANTE"
          this.message.colorIcon = "red"
          this.message.colorTitle= "red"
          this.message.visible = true

        }
      })

    }


  }

  private editar() {

  }

}
