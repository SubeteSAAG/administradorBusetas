import { InformacionPersonalModel } from "./informacion-personal";

export interface PasajeroModel{
    id?: number,
    codigoPasajero?: number,
    empresaId?: number,
    updatedOn?: string,
    informacionPersonal: InformacionPersonalModel
    ubicacionDomicilio?: string,
    abordo?: string,
    esEstudiante?: string

}


