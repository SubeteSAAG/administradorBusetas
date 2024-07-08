export interface Menu{
    id_menu: number;
    nombre: string;
    path: string;
    icono: string;
    estado: boolean;
    notificacion?: Notificacion;
    submenus: Menu[];
    isOpen?: boolean;
}

export interface Notificacion{
    id_notificacion: number;
    descripcion: string;
    numero_notificacion: number;
}

