import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BarraMenuService } from '@services/barra-menu-service';
import { LoadingService } from '@services/loading-service';
import { UsuarioService } from '@services/usuario-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '@shared/loading/loading.component'
import { EntityService } from '@services/entity-service';
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { MessageService, PrimeNGConfig} from 'primeng/api';
import { InformacionPersonalModel } from '@models/informacion-personal';
import { UserModel, UsuarioModel } from '@models/usuario';
import { ApiResponse } from '@models/api-response';
import { MessageComponent } from '@shared/message/message.component'
import { MessageModel } from '@models/message';


@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingComponent,
    PRIMENG_MODULES,
    MessageComponent
  ],
  providers: [MessageService],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export default class UsuarioComponent {

  titulo = "Mantenimiento Usuarios"
  enableLoading = false
  responsiveOptions: any[] | undefined;



  private guardarSubscription!: Subscription;
  private editarSubscription!: Subscription;

  usuarioForm!: FormGroup

  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceUsuario = inject(UsuarioService)
  private readonly serviceEntity = inject(EntityService)

  /*user: UsuarioModel = {
    email: "cris",
    password: "123",
    userName: "usue",
    name: "cris"
  }*/

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

  userOptions: any[] = [
    { name: 'Conductor', value: 1 },
    { name: 'Representante', value: 2 },
  ];
  selectUser: number = 1;
  
  ltsUserConducotres = this.serviceUsuario.ltsUsuariosConducotres

  ltsImages: any[] = [
    { id_image: 1, nombre: "Imagen 1", url: "https://www.primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg" },
    { id_image: 2, nombre: "Imagen 2", url: "https://www.primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg" },
  ];

  files = [];
  totalSize : number = 0;
  totalSizePercent : number = 0;
  index!: number
  ltsFiles: any[] = []

  ltsTpoDocumento: any[] = [
    { id_tipo_doc: 1, nombre: "Documento Matricula" },
    { id_tipo_doc: 2, nombre: "Documento Licencia" },
  ];

  selectDocumento = this.ltsTpoDocumento[0]
  estadoSubido: boolean = false
  message!: MessageModel

  constructor(
    private serviceBarraMenu: BarraMenuService,
    private fb: FormBuilder,
    private config: PrimeNGConfig,
    private messageService: MessageService
  ) {

    this.usuarioForm = this.fb.group(
      {
        name: new FormControl('', [Validators.required]),
        userName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),  
        password: new FormControl('', [Validators.required]),
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

    console.log("mando info")
    //this.serviceEntity.setEntity(this.user)

    /*this.responsiveOptions = [
      {
          breakpoint: '1400px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '1220px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '1100px',
          numVisible: 1,
          numScroll: 1
      }
    ];*/
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



  choose(event: any, callback: any) {
    callback();
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any, i: number) {
      removeFileCallback(event, index);
      console.log("ssss")
      console.log(i)
      this.totalSize -= parseInt(this.formatSize(file.size));
      this.totalSizePercent = this.totalSizePercent - 50;
      console.log("tam actial")
      console.log(this.ltsFiles.length)
      this.ltsFiles = this.ltsFiles.filter(file => file.id != i);
      console.log("nueva lista")
      console.log(this.ltsFiles.length)
  }

  onClearTemplatingUpload(clear: any) {
      clear();
      this.totalSize = 0;
      this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    console.log("temasasass")
    //this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  clear(event: any, callback: any){
    callback();
    this.ltsFiles = []
    this.totalSizePercent = 0
  }

  onSelectedFiles(event: any) {

    if(this.totalSizePercent == 100){
      this.message.description = "YA ESTAN LOS DOS DOCUMENTOS CARGADOS!!!"
      this.message.icon = "pi pi-file"
      this.message.title = "ADVERTENCIA DOCUMENTOS"
      this.message.colorIcon = "blue"
      this.message.colorTitle= "blue"
      this.message.visible = true

    }else{
      
      this.files = event.currentFiles;
      this.files.forEach((file: any) => {
          this.totalSize += parseInt(this.formatSize(file.size));
      });
      this.totalSizePercent = this.totalSizePercent + 50;

      const characters = '0123456789';
      const code = Array.from({ length: 4 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');

      let objFile = {
        id:  code,
        nombre: event.currentFiles[this.files.length-1].name,
        tipo: event.currentFiles[this.files.length-1].type,
        tipoDocumento: this.selectDocumento.id_tipo_doc,
        nombreDocumento: this.selectDocumento.nombre,
        file: event.currentFiles[this.files.length-1],
        size: event.currentFiles[this.files.length-1].size
      }
      this.ltsFiles = [...this.ltsFiles, objFile]
    }

    console.log("docuemntososos")
    console.log(this.files)
  }

  uploadEvent(event: any,callback: any) {
    callback();
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });


  }


  formatSize(bytes: any) {
      const k = 1024;
      const dm = 3;
      const sizes = this.config.translation.fileSizeTypes;
      if (bytes === 0) {
          return `0 ${(sizes ??[])[0]}`;
      }

      const i = Math.floor(Math.log(bytes) / Math.log(k));
      const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

      return `${formattedSize} ${(sizes ?? [])[i]}`;
  }

  cambioEstado(){
    this.totalSizePercent = 0
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



  private guardar() {

    let valida = this.validateForm();
    if(valida){

      if(this.ltsFiles.length < 2 && this.selectUser == 1){
        this.message.description = "NECESITA AGREGAR LOS DOCUMENTOS!!!"
        this.message.icon = "pi pi-file"
        this.message.title = "ADVERTENCIA DOCUMENTOS"
        this.message.colorIcon = "blue"
        this.message.colorTitle= "blue"
        this.message.visible = true
  
        return
      }

      this.serviceLoading.show()

      const formData = this.usuarioForm.value;
      const formValues =  this.usuarioForm.getRawValue();
      console.log("tipo usurio")
      console.log(this.selectUser)

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

      const user: UserModel = {
        name: formValues.name,
        userName: formValues.userName,
        email: formValues.email,
        password: formValues.password,
        tipo: this.selectUser
      }

      const usuarioRepresentante: UsuarioModel = {
        usuario: user,
        informacionPersonal: informacion,
      } 



      if(this.selectUser == 1){

        const usuario: UsuarioModel = {
          usuario: user,
          informacionPersonal: informacion,
          urlImagenMatricula: "",
          urlImagenLicencia: ""

        } 


        this.serviceUsuario.saveUsuarioConductor(usuario).subscribe({
          next: (response: ApiResponse) =>{
            console.log("resssssss")
            console.log(response)
            if(response.statusCode == 200){
              this.message.description = "USUARIO CONDUCTOR CREADO!!!"
              this.message.icon = "pi pi-user-plus"
              this.message.title = "CREACIÓN DE USUARIOS"
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
          error: (error) =>{
            this.serviceLoading.hide()
            this.message.description = ""+error.message
            this.message.icon = "pi pi-times"
            this.message.title = "CREACIÓN DE USUARIOS"
            this.message.colorIcon = "red"
            this.message.colorTitle= "red"
            this.message.visible = true
   
          }
        })
  

      }else{

        this.serviceUsuario.saveUsuarioRepresentante(usuarioRepresentante).subscribe({
          next: (response: ApiResponse) =>{
            console.log("representante")
            console.log(response)
            if(response.statusCode == 200){
              this.message.description = "USUARIO REPRESENTANTE CREADO!!!"
              this.message.icon = "pi pi-user-plus"
              this.message.title = "CREACIÓN DE USUARIOS"
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
          error: (error) =>{
            this.serviceLoading.hide()
            this.message.description = ""+error.message
            this.message.icon = "pi pi-times"
            this.message.title = "CREACIÓN DE USUARIOS"
            this.message.colorIcon = "red"
            this.message.colorTitle= "red"
            this.message.visible = true

   
          }
        })

      }


    }

  }

  private editar() {
  }

  buscar(data: { tipo: string, valor: string }) {

  }


}
