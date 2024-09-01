import { InformacionPersonalModel } from "./informacion-personal";

export interface PasajeroModel{
    id?: number,
    codigoPasajero?: number,
    empresaId?: number,
    updatedOn?: string,
    informacionPersonal: InformacionPersonalModel,
    ubicacionDomicilio?: string,
    abordo?: string,
    esEstudiante?: string

}

export interface PasajeroEditModel {
    id: number
    infoPersonal: InformacionPersonalModel
}

export interface PasajeroListaModel{
    id: number,
    codigoPasajero: string,
    empresaId: number,
    updatedOn: string,
    informacionPersonal: {
      nombres: string,
      apellidos: string,
      sobreNombre: string,
      tipoIdentificacion: number,
      identificacion: string,
      telefono: string,
      celular: string,
      fechaNacimiento: string,
      direccion: string
    },
    ubicacionDomicilio: string,
    abordo: string,
    esEstudiante: boolean
}

export interface AsignarPasajeroRutaModel {
  pasajeroId: number,
  busetaRutaId: number
}


