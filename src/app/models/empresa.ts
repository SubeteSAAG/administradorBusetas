
export interface EmpresaModel{
    id?: number
    nombre: string,
    description: string,
    ruc: string,
    tipo: number
    selected?: boolean;
    isDeleted?: boolean
    isActive?: boolean
}


export interface CreateEmpresaModel{
    
    nombre: string,
    description: string,
    ruc: string,
    tipo: number,
    usuarioAdmin: UsuarioAdminModel
    
}

export interface UsuarioAdminModel{
    name: string,
    userName: string,
    email: string,
    password: string,
    tipo: number
}


export interface EditEmpresaModel{
    
    id: number,
    nombre: string,
    description: string,
    ruc: string,
    tipo: number,
    
}
