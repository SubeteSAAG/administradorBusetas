import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ButtonComponent } from '@shared/button/button.component';
import { Subscription } from 'rxjs';
import { BarraMenuService } from '@services/barra-menu-service'
import { FormBuilder, FormGroup, Validator, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { MessageComponent } from '@shared/message/message.component'
import { MessageModel } from '@models/message';
import { LoadingComponent } from '@shared/loading/loading.component'
import { LoadingService } from '@services/loading-service';
import { EntityService } from '@services/entity-service';
import { ConductorService } from '@services/conductor-service';


@Component({
  selector: 'app-conductor',
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    PRIMENG_MODULES,
    MessageComponent
  ],
  templateUrl: './conductor.component.html',
  styleUrl: './conductor.component.scss'
})
export default class ConductorComponent implements OnInit, OnDestroy{

  titulo = "Mantenimiento Conductor"

  private guardarSubscription!: Subscription;
  private editarSubscription!: Subscription;
  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceEntity = inject(EntityService)
  private readonly serviceConducotr = inject(ConductorService)

  conductorForm!: FormGroup


  message!: MessageModel


  constructor(
    private serviceBarraMenu: BarraMenuService,
    private fb: FormBuilder
  ) {

    this.conductorForm = this.fb.group(
      {
        cedula: new FormControl('', [Validators.required]),
        nombre: new FormControl('', [Validators.required]),
        apellido: new FormControl('', [Validators.required]),
        telefono: new FormControl('', [Validators.required]),
        direccion: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),

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
  }

  ngOnDestroy() {
    if(this.guardarSubscription){
      this.guardarSubscription.unsubscribe();
    }
    if(this.editarSubscription){
      this.editarSubscription.unsubscribe();
    }
  }

  onSubmit(){
    this.validateForm()
  }

  validateForm(): boolean{
    let response = true
    if(this.conductorForm.valid){
      response = true;
    }else{
      this.message.description = "FALTAN CAMPOS DE LLENAR!!!"
      this.message.icon = "pi pi-info"
      this.message.title = "ADVERTENCIA"
      this.message.colorIcon = "blue"
      this.message.colorTitle= "blue"
      this.message.visible = true
      this.conductorForm.markAllAsTouched()
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



  private guardar() {

    let valida = this.validateForm();
    if(valida){
      const formData = this.conductorForm.value;
      console.log(formData);
    }else{
      console.log("no entra")
    }

  }

  private editar() {
    // Implementa la lógica para editar los datos del conductor
    console.log('Editar datos del conductor');
  }

  buscar(data: { tipo: string, valor: string }) {
    // Lógica para buscar datos
    console.log(`Buscando por ${data.tipo}: ${data.valor}`);
  }


}
