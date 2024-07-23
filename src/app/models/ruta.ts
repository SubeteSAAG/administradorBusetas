export interface RutaModel {
    name: string,
    description: string,
    empresaId?: number,
    empresa?: string,
    horario?: hoarioModel[],
    createdOn?: string,
    createdBy?: string,
    updatedOn?: string,
    updatedBy?: string,
    isDeleted?: boolean,
    isActive?: boolean,
    id?: number,
    domainEvents?: any[]
}


export interface hoarioModel {
    id?: number
    dia :number,
    nombreDia:string,
    horaSalida:number,
    horaLlegada:number
    Dia? :number,
    NombreDia?:string,
    HoraSalida?:number,
    HoraLlegada?:number

}