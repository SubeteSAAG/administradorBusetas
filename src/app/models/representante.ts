import { InformacionPersonalModel } from "./informacion-personal";
import { UsuarioModel } from "./usuario";

export interface RepresentanteModel {
    id?: number,
    informacionPersonalId?: number,
    empresaId?: number,
    usuarioId?: number,
    informacionPersonal?: InformacionPersonalModel,
    usuario?: UsuarioModel
}