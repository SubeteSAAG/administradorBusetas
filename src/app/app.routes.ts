import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { loginGuard } from '@guards/login.guard'
import { redirectGuard } from '@guards/redirect.guard'

export const routes: Routes = [
    {
        path: 'login',
        canActivate: [ redirectGuard ],
        loadComponent: () => import('@features/login/login.component')
    },
    {
        path: 'dashboard',
        canActivate: [ loginGuard ],
        loadComponent: () => import('@features/dashboard/dashboard.component'),
        children: [
            /*{
                path: 'conductor',
                title: 'Conductor',
                loadComponent: () => import('@features/pages/moduleConductor/conductor/conductor.component')
            },*/
            {
                path: 'empresa',
                title: 'Empresa',
                loadComponent: () => import('@features/pages/moduleEmpresa/empresa/empresa.component')
            },
            {
                path: 'usuario',
                title: 'Usuario',
                loadComponent: () => import('@features/pages/moduleUsuario/usuario/usuario.component')
            },
            {
                path: 'buseta',
                title: 'Buseta',
                loadComponent: () => import('@features/pages/moduleBuseta/buseta/buseta.component')
            },
            {
                path: 'estudiante',
                title: 'Estudiante',
                loadComponent: () => import('@features/pages/moduleEstudiante/estudiante/estudiante.component')
            },
            {
                path: 'ruta',
                title: 'Ruta',
                loadComponent: () => import('@features/pages/moduleRuta/ruta/ruta.component')
            },
            {
                path: 'pasajero',
                title: 'Pasajero',
                loadComponent: () => import('@features/pages/modulePasajero/pasajero/pasajero.component')
            },
            {
                path: 'asignacion-buseta',
                title: 'Asignaciones de Buseta',
                loadComponent: () => import('@features/pages/moduleBuseta/asignaciones/asignaciones.component')
            },
            {
                path: 'gestion-pasajero',
                title: 'Gestión de Pasajeros',
                loadComponent: () => import('@features/pages/modulePasajero/gestion-pasajero/gestion-pasajero.component')
            },
            {
                path: 'gestion-usuario',
                title: 'Gestión de Usuarios',
                loadComponent: () => import('@features/pages/moduleUsuario/gestion-usuarios/gestion-usuarios.component')
            },
            {
                path: '',
                redirectTo: '/dashboard/usuario',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];
