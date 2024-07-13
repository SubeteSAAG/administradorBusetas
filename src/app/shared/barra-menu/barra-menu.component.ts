import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng/primeng';
import { MenuItem } from 'primeng/api';
import { CommonModule} from '@angular/common'
import { BarraMenuService } from '@services/barra-menu-service'

@Component({
  selector: 'app-barra-menu',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    CommonModule,
  ],
  templateUrl: './barra-menu.component.html',
  styleUrl: './barra-menu.component.scss',
})
export class BarraMenuComponent {



  items: MenuItem[] | undefined;

  constructor(private serviceBarraMenu: BarraMenuService) {}

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

    this.serviceBarraMenu.onBuscar()
 
  }

}
