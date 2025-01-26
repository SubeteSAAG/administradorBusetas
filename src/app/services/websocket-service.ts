import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private hubConnection!: signalR.HubConnection;
  private locationSubject = new Subject<any>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  location$: Observable<any> = this.locationSubject.asObservable();
  connectionStatus$: Observable<boolean> = this.connectionStatusSubject.asObservable();

  private vehicleCodes = ["755be338acaa49aab86241dd0c7a7349", "97545cabb8b64b96a0877e4286272961", "a2ab61fe81a54730b11e136835243204", "97fca14c55d64cbbb85fab3860d2a107", "7c9a5ff02e314fb3a601ae692f287d28"];
  private reconnectDelay = 5000; // 5 segundos

  constructor() {
    this.createConnection();
    this.startConnection();
  }

  private createConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://api.lamaapp.ec/vehicletackinghub")
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          return this.reconnectDelay;
        }
      })
      .build();

    this.hubConnection.on("ReceiveLocation", (location) => {
      console.log("Location received: ", location);
      this.locationSubject.next(location);
    });

    this.hubConnection.onreconnecting(() => {
      console.log('Attempting to re-connect to the server');
      this.connectionStatusSubject.next(false);
    });

    this.hubConnection.onreconnected(() => {
      console.log('Reconnected to the server');
      this.connectionStatusSubject.next(true);
      this.joinVehicleGroups();
    });
  }

  private startConnection() {
    this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
        this.connectionStatusSubject.next(true);
        this.joinVehicleGroups();
      })
      .catch(err => {
        console.error('Error while starting connection: ' + err);
        setTimeout(() => this.startConnection(), this.reconnectDelay);
      });
  }

  private joinVehicleGroups() {
    console.log('Joining vehicle groups');
    this.hubConnection.invoke("JoinVehicleGroup", this.vehicleCodes)
      .catch(err => console.error('Error joining vehicle groups: ' + err));
  }

  public addVehicleCode(code: string) {
    if (!this.vehicleCodes.includes(code)) {
      this.vehicleCodes.push(code);
      if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
        this.hubConnection.invoke("JoinVehicleGroup", [code])
          .catch(err => console.error('Error joining new vehicle group: ' + err));
      }
    }
  }

  public removeVehicleCode(code: string) {
    const index = this.vehicleCodes.indexOf(code);
    if (index > -1) {
      this.vehicleCodes.splice(index, 1);
      if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
        this.hubConnection.invoke("LeaveVehicleGroup", [code])
          .catch(err => console.error('Error leaving vehicle group: ' + err));
      }
    }
  }

  public stopConnection() {
    this.hubConnection.stop()
      .then(() => {
        console.log('Connection stopped');
        this.connectionStatusSubject.next(false);
      })
      .catch(err => console.error('Error while stopping connection: ' + err));
  }
}





