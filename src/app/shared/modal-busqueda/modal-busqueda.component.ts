import { Component, inject, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng/primeng';
import { CommonModule} from '@angular/common'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { SearchService } from '@services/search-service';


@Component({
  selector: 'app-modal-busqueda',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './modal-busqueda.component.html',
  styleUrl: './modal-busqueda.component.scss'
})
export class ModalBusquedaComponent implements OnInit {

  visible!: boolean 
  content!: string;
  value: string = ""

  private readonly serviceSearch = inject(SearchService)


  constructor(public ref: DynamicDialogRef, 
    private config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    if (this.config.data) {
      this.visible = this.config.data.visible
      this.content = this.config.data.content;
    }

  }
  

  onInputChange(event: any) {
    this.value = event.target.value;
    this.serviceSearch.onSearchValue(this.value)
  }

  onEnterKey(): void {
    this.ref.close(this.value);
  }


}
