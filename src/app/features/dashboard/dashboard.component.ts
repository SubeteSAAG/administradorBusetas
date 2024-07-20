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
  

  private readonly serviceToken = inject(TokenService)
  userLogged: Usuario | null = null;

  ltsMenus: Menu[] = [
    
    {
      id_menu: 1,
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
        }
      ]
    },
    /*{
      id_menu: 2,
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
    },*/
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
      id_menu: 4,
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
          nombre: 'Asignación',
          icono: 'pi pi-comments',
          estado: true,
          path: '/dashboard/asignarBuseta',
          isOpen: false,
          submenus: []

        }
      ]
    },
    {
      id_menu: 5,
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
      id_menu: 6,
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
          nombre: 'Asignación',
          icono: 'pi pi-comments',
          estado: true,
          path: '/asignarRuta',
          isOpen: false,
          submenus: []

        }
    
      ]
    },
    {
      id_menu: 7,
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
      id_menu: 8,
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

  }

  toggleMenu(menu: Menu) {
    menu.isOpen = !menu.isOpen;
  }

  toggleSubmenu(menu: Menu, submenu: Menu) {
    submenu.isOpen = !submenu.isOpen;
  }

  navigate(path: string) {
    if (path) {
      //console.log("clik menu")
      //this.serviceEntity.setEntity(this.user)
      this.route.navigate([path]);

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
