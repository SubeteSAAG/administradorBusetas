import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { BarraMenuService } from '@services/barra-menu-service'
import { EntityService } from '@services/entity-service';
import { LoadingService } from '@services/loading-service';
import { EmpresaModel } from '@models/empresa';
import { MessageModel } from '@models/message';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '@shared/loading/loading.component'
import { PRIMENG_MODULES } from '../../../../primeng/primeng';
import { MessageComponent } from '@shared/message/message.component'
import { ModalBusquedaComponent} from '@shared/modal-busqueda/modal-busqueda.component'
import { EmpresaService } from '@services/empresa-service';
import { SearchService } from '@services/search-service';


@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingComponent,
    PRIMENG_MODULES,
    MessageComponent,
    ModalBusquedaComponent,

  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export default class EmpresaComponent {

  titulo = "Mantenimiento Empresas"


  private guardarSubscription!: Subscription;
  private editarSubscription!: Subscription;
  private buscarSubscription!: Subscription;
  private searchSubscription!: Subscription;

  private readonly serviceEntity = inject(EntityService)
  private readonly serviceLoading = inject(LoadingService)
  private readonly serviceBarraMenu = inject(BarraMenuService)
  private readonly serviceEmpresa = inject(EmpresaService)
  private readonly serviceSearch = inject(SearchService)


  ltsEmpresas = this.serviceEmpresa.ltsEmpresas

  listSearchEmpresas: EmpresaModel[] = []
  message!: MessageModel
  ref!: DynamicDialogRef;
  enableLoading = false
  empresaForm!: FormGroup


  constructor(private fb: FormBuilder,){

    this.empresaForm = this.fb.group(
      {
        nombre: new FormControl('', [Validators.required]),
        descripcion: new FormControl('', [Validators.required]),
        ruc: new FormControl('', [Validators.required]),
      }
    )


  }

  ngOnInit() {

    this.serviceBarraMenu.onPanelInformativo()

    this.serviceLoading.loading$.subscribe((isLoading) => {
      this.enableLoading = isLoading;
    });

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
      const empresa = this.ltsEmpresas();
      if (empresa && empresa.data && empresa.data.length > 0) {
        this.listSearchEmpresas = empresa.data.filter((empresa: EmpresaModel) => empresa.nombre.toString().toUpperCase() === value.toUpperCase() || empresa.ruc?.toString().toUpperCase() === (value.toUpperCase())) ;
        console.log('Resultado de la búsqueda:', this.listSearchEmpresas);
        if(this.listSearchEmpresas.length == 1){
          this.serviceEntity.setEntity(this.listSearchEmpresas[0])
        }
      }
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
    if(this.empresaForm.valid){
      response = true;
    }else{
      this.message.description = "FALTAN CAMPOS DE LLENAR!!!"
      this.message.icon = "pi pi-info"
      this.message.title = "ADVERTENCIA"
      this.message.colorIcon = "blue"
      this.message.colorTitle= "blue"
      this.message.visible = true
      this.empresaForm.markAllAsTouched()
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
    console.log('Guardar datos de empresa');


  }

  private editar() {
    console.log('Editar datos del empresa');
  }

  private buscar(){

  }


}
