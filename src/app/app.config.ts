import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

//PRIMENG

import {MessageService} from 'primeng/api'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AuthInterceptor } from '@interceptors/auth-interceptor';
import { ErrorApiInterceptor } from '@interceptors/error-api-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    //provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    //provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([ErrorApiInterceptor, AuthInterceptor])),
    provideAnimationsAsync(),
    MessageService,
    DialogService,
    DynamicDialogRef,
    DynamicDialogConfig

  ]
};
