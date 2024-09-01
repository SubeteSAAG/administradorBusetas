import { Component, OnInit, inject} from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng/primeng';
import { Menu } from '@models/menu';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BarraMenuComponent} from '@shared/barra-menu/barra-menu.component'
import { InformacionPersonaComponent} from '@shared/informacion-persona/informacion-persona.component'
import { LoginService } from '@services/login-service'
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Usuario } from '@models/response-login';
import { TokenService } from '@services/token-service';
import { BusetaModel } from '@models/buseta';
import { EntityService } from '@services/entity-service';
import { Subscription } from 'rxjs';
import { BarraMenuService } from '@services/barra-menu-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    CommonModule,
    RouterModule,
    BarraMenuComponent,
    InformacionPersonaComponent,
    OverlayPanelModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent implements OnInit {
  
  private panelInformativoSubscription!: Subscription;


  private readonly serviceToken = inject(TokenService)
  private readonly serviceEntity = inject(EntityService)
  private readonly serviceMenuBarra = inject(BarraMenuService)

  userLogged: Usuario | null = null;
  listSearchBusetas: BusetaModel[] = []
  vidibelComponents: boolean = true
  ltsPathsIndependientes: any[] = [
    {
      id_menu: 2,
      path: 'asignacion-buseta',
    },
    {
      id_menu: 2,
      path: 'gestion-pasajero'
    },
    {
      id_menu: 2,
      path: 'gestion-usuario'
    }
  ]


  ltsMenus: Menu[] = [
    {
      id_menu: 1,
      nombre: 'Empresas',
      icono: 'pi pi-warehouse',
      estado: true,
      path: '',
      isOpen: false,
      submenus: [
        {
          id_menu: 1,
          nombre: 'Mantenimiento',
          icono: 'pi pi-comments',
          estado: true,
          path: '/dashboard/empresa',
          isOpen: false,
          submenus: []
        }
      ]
    },
    {
      id_menu: 2,
      nombre: 'Usuarios',
      icono: 'pi pi-user',
      estado: true,
      path: '',
      isOpen: false,
      submenus: [
        {
          id_menu: 1,
          nombre: 'Mantenimiento',
          icono: 'pi pi-comments',
          estado: true,
          path: '/dashboard/usuario',
          isOpen: false,
          submenus: []
        },
        {
          id_menu: 2,
          nombre: 'Gestión de Usuarios',
          icono: 'pi pi-user',
          estado: true,
          path: '/dashboard/gestion-usuario',
          isOpen: false,
          submenus: []

        }

      ]
    },
    /*{
      id_menu: 3,
      nombre: 'Conductor',
      icono: 'pi pi-user',
      estado: true,
      path: '',
      isOpen: false,
      submenus: [
        {
          id_menu: 1,
          nombre: 'Mantenimiento',
          icono: 'pi pi-comments',
          estado: true,
          path: '/dashboard/conductor',
          isOpen: false,
          submenus: []

        }
      ]
    },*/
    {
      id_menu: 3,
      nombre: 'Busetas',
      icono: 'pi pi-car',
      estado: true,
      path: '',
      isOpen: false,
      submenus: [
        {
          id_menu: 1,
          nombre: 'Mantenimiento',
          icono: 'pi pi-comments',
          estado: true,
          path: '/dashboard/buseta',
          isOpen: false,
          submenus: []
        },
        {
          id_menu: 2,
          nombre: 'Gestión de Busetas',
          icono: 'pi pi-comments',
          estado: true,
          path: '/dashboard/asignacion-buseta',
          isOpen: false,
          submenus: []

        }
      ]
    },
    {
      id_menu: 4,
      nombre: 'Estudiante',
      icono: 'pi pi-user',
      estado: true,
      path: '',
      isOpen: false,
      submenus: [
        {
          id_menu: 1,
          nombre: 'Mantenimiento',
          icono: 'pi pi-comments',
          estado: true,
          path: '/dashboard/estudiante',
          isOpen: false,
          submenus: []
        }
    
      ]
    },
    {
      id_menu: 5,
      nombre: 'Pasajero',
      icono: 'pi pi-user',
      estado: true,
      path: '',
      isOpen: false,
      submenus: [
        {
          id_menu: 1,
          nombre: 'Mantenimiento',
          icono: 'pi pi-comments',
          estado: true,
          path: '/dashboard/pasajero',
          isOpen: false,
          submenus: []
        },
        {
          id_menu: 2,
          nombre: 'Gestión Pasajeros',
          icono: 'pi pi-comments',
          estado: true,
          path: '/dashboard/gestion-pasajero',
          isOpen: false,
          submenus: []

        }
    
      ]
    },
    {
      id_menu: 6,
      nombre: 'Rutas',
      icono: 'pi pi-map',
      estado: true,
      path: '',
      isOpen: false,
      submenus: [
        {
          id_menu: 1,
          nombre: 'Mantenimiento',
          icono: 'pi pi-comments',
          estado: true,
          path: '/dashboard/ruta',
          isOpen: false,
          submenus: []
        },
    
      ]
    },
    {
      id_menu: 7,
      nombre: 'Recorridos',
      icono: 'pi pi-map-marker',
      estado: true,
      path: '',
      isOpen: false,
      submenus: [
        {
          id_menu: 1,
          nombre: 'Mantenimiento',
          icono: 'pi pi-comments',
          estado: true,
          path: '/dashboard/recorrido',
          isOpen: false,
          submenus: []
        },
    
      ]
    }

  ];



  constructor(
    private serviceLogin: LoginService,
    private route: Router
  ){

    
  }


  ngOnInit(): void {
      console.log('init appp..>>')
      this.userLogged = this.serviceToken.getDetailUser()

    this.panelInformativoSubscription = this.serviceMenuBarra.getPanelInformativoObservable().subscribe(() => {
      const valor = localStorage.getItem('visible');
      if(valor == "true"){
        this.vidibelComponents = true
      }else{
        this.vidibelComponents = false
      }
    });
  

  }

  clearPanel(){
    this.serviceEntity.setEntity(this.listSearchBusetas[0])
  }

  toggleMenu(menu: Menu) {
    menu.isOpen = !menu.isOpen;
  }

  toggleSubmenu(menu: Menu, submenu: Menu) {
    submenu.isOpen = !submenu.isOpen;
  }

  navigate(path: string) {
    if (path) {
      console.log(path)
      console.log(path.split('/')[2])
      const index = this.ltsPathsIndependientes.findIndex(item => item.path === path.split('/')[2])
      localStorage.setItem('path', path.split('/')[2]);
      console.log("indeccccxxxx")
      console.log(index)
      if(index != -1){
        this.vidibelComponents = false
        localStorage.setItem('visible', 'false');
      }else{
        this.vidibelComponents = true
        localStorage.setItem('visible', 'true');

      }
      this.route.navigate([path]);
      this.clearPanel()
    }
  }

  onProfileClick(event: Event, overlaypanel: OverlayPanel) {
    overlaypanel.toggle(event);
  }

  navigateToProfile() {
    // Navegar al perfil del usuario
  }


  logout(){
    this.serviceLogin.logout()
    this.route.navigate(["/login"])
  }


}
