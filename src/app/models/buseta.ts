
export interface BusetaModel{
    id?: number;
    name: string;
    description: string;
    propietario: string;
    capacidad: number;
    conductorId?: number;
    createdOn?: string,
    createdBy?: string,
    updatedOn?: string,
    updatedBy?: string,
    isDeleted?: boolean,
    isActived?: boolean,
    placa: string

}