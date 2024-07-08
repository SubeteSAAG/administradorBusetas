import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng/primeng';
import { MenuItem } from 'primeng/api';
import { CommonModule} from '@angular/common'
import { ModalBusquedaComponent} from '@shared/modal-busqueda/modal-busqueda.component'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BarraMenuService } from '@services/barra-menu-service'

@Component({
  selector: 'app-barra-menu',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    CommonModule,
    ModalBusquedaComponent
  ],
  templateUrl: './barra-menu.component.html',
  styleUrl: './barra-menu.component.scss'
})
export class BarraMenuComponent {



  items: MenuItem[] | undefined;

  constructor(private dialogService: DialogService, private serviceBarraMenu: BarraMenuService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Guardar',
        icon: 'pi pi-save'
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil'
      },
      {
        label: 'Buscar',
        icon: 'pi pi-search',
      }
    ];
  }

  accionItem(item: any) {
    switch(item.label) {
      case 'Guardar':
        this.guardarDatos();
        break;
      case 'Editar':
        this.editarDatos();
        break;
      case 'Buscar':
        this.abrirModalBusqueda();
        break;
      default:
        console.warn('Acción no definida para:', item.label);
        break;
    }
  }

  private guardarDatos() {
   
    this.serviceBarraMenu.onGuardar()
    
  }

  private editarDatos() {
 
    this.serviceBarraMenu.onEditar()
  }

  private abrirModalBusqueda() {
    console.log('clisis')
    const ref: DynamicDialogRef = this.dialogService.open(ModalBusquedaComponent, {
      header: 'Buscar',
      width: '50%'
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.serviceBarraMenu.onBuscar(result);
      }
    });
  }

}
