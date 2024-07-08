import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng/primeng';
import { CommonModule} from '@angular/common'
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-busqueda',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-busqueda.component.html',
  styleUrl: './modal-busqueda.component.scss'
})
export class ModalBusquedaComponent {

  buscarPor: 'codigo' | 'nombre' = 'codigo';
  valorBusqueda: string = '';

  constructor(public ref: DynamicDialogRef) {}


  buscar() {
    this.ref.close({ tipo: this.buscarPor, valor: this.valorBusqueda });
  }
  
  cancelar() {
    this.ref.close();
  }
}
