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
    selected?: boolean;
}

export interface RutaBusetaModel {
    selected?: boolean;
    busetaId?: number,
    buseta: {
        name?: string,
        description?: string,
        propietario?: string,
        capacidad?: number,
        conductorId?: number,
        conductor?: string,
        placa?: string,
        code?: string,
        createdOn?: string,
        createdBy?: string,
        updatedOn?: string,
        updatedBy?: string,
        isDeleted?: boolean,
        isActive?: boolean,
        id?: number,
        domainEvents?: any[]
    },
    rutaId?: 12,
    ruta: {
        name?: string,
        description?: string,
        empresaId?: number,
        empresa?: any,
        horario?: hoarioModel,
        createdOn?: string,
        createdBy?: string,
        updatedOn?: string,
        updatedBy?: string,
        isDeleted?: boolean,
        isActive?: boolean,
        id?: 12,
        domainEvents?: any[]
    },
    capacidad?: number,
    createdOn?: string,
    createdBy?: string,
    updatedOn?: string,
    updatedBy?: string,
    isDeleted?: boolean,
    isActive?: boolean,
    id?: number,
}


export interface hoarioModel {
    id?: number
    dia :number,
    nombreDia:string,
    horaSalida:number,
    horaLlegada:number
    Dia?: number,
    NombreDia?:string,
    HoraSalida?:number,
    HoraLlegada?:number

}