import { InformacionPersonalModel } from "./informacion-personal";

export interface EstudianteModel{
    id?: number,
    estudianteId?: number,
    codigoPasajero?: string,
    empresaId?: number,
    updatedOn?: string,
    infoPersonal: InformacionPersonalModel,
    informacionPersonal?: InformacionPersonalModel,
    representanteId?: number,
    ubicacionDomicilio?: string,
    abordo?: string,
    esEstudiante?: boolean,
    direccionDomicilio?: string,
    ubicacion?: ubicacion

}

export interface ubicacion{

    lat: number,
    lon: number,
    mocked: boolean,
    timestamp: number
    coords: coords
}

export interface coords{

    speed: number,
    heading: number,
    altitude: number,
    accuracy: number,
    longitude: number,
    latitude: number

}