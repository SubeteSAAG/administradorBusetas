import { InformacionPersonalModel } from "./informacion-personal"

export interface UsuarioModel{
    id?: number
    usuario: UserModel,
    informacionPersonal: InformacionPersonalModel
    urlImagenMatricula?: string,
    urlImagenLicencia?: string
}

export interface UserModel{
    
    id?: number
    name: string,
    userName: string,
    email: string,
    password?: string,
    tipo: number
    empresaId?: number
    isActive?: boolean
}


export interface ResponseUsuario {
    id: number,
    informacionPersonalId: number,
    urlImagenMatricula: string,
    urlImagenLicencia: string,
    empresaId: number,
    usuarioId: number,
    informacionPersonal: InformacionPersonalModel
    representanteId: number
    selected?: boolean;

}