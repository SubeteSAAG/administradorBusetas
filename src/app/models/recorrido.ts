import { ubicacion } from "./estudiante";
import { hoarioModel } from "./ruta";

export interface RecorridoModel{
    
    recorridoId?: number,
    busetaRutaId?: number,
    descripcion?: string,
    calificacion?: number,
    estado?: number,
    fechaIniciado?: string,
    fechaFinalizado?: string,
    ubicacionIniciado?: ubicacion,
    ubicacionFinalizado?: ubicacion,
    createdOn?: string,
    busetaId?: number,
    busetaName?: string,
    busetaDescription?: string,
    placa?: string,
    rutaId?: number,
    rutaName?: string,
    rutaDescription?: string,
    horario?: hoarioModel,
    empresaId?: number
      
}