import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { BarraMenuService } from '@services/barra-menu-service'


@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export default class EmpresaComponent {

  private guardarSubscription!: Subscription;
  private editarSubscription!: Subscription;


  constructor(
    private serviceBarraMenu: BarraMenuService,
  ){

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


  private guardar() {
    console.log('Guardar datos de empresa');


  }

  private editar() {
    console.log('Editar datos del empresa');
  }


}
