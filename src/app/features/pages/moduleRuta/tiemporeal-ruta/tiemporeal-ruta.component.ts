import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { BarraMenuService } from '@services/barra-menu-service';
import { WebSocketService } from '@services/websocket-service';


@Component({
  selector: 'app-tiemporeal-ruta',
  standalone: true,
  imports: [GoogleMap, MapAdvancedMarker],
  templateUrl: './tiemporeal-ruta.component.html',
  styleUrls: ['./tiemporeal-ruta.component.scss']
})
export default class TiemporealRutaComponent implements OnInit, OnDestroy {

  private readonly serviceBarraMenu = inject(BarraMenuService)
  private readonly webSocketService = inject(WebSocketService)

  center: google.maps.LatLngLiteral = { lat: 22.2736308, lng: 70.7512555 };
  zoom = 4;
  connectionStatus : boolean = false

  constructor() { 
    this.webSocketService.connectionStatus$.subscribe(v => this.connectionStatus = v)

    this.webSocketService.location$.subscribe((l) => {
      console.log("Location received: ", l);
    });

  }


  ngOnInit(): void {

    this.serviceBarraMenu.onPanelInformativo()

  }

  ngOnDestroy(): void {
    //this.webSocketService.stopConnection()
  }


}
