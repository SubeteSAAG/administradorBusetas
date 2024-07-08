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
            {
                path: 'conductor',
                title: 'Conductor',
                loadComponent: () => import('@features/pages/moduleConductor/conductor/conductor.component')
            },
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
                path: '',
                redirectTo: '/dashboard/conductor',
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
