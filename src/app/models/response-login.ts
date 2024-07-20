export interface ResponseLogin{
    success: boolean,
    statusCode: number,
    data: usuario,
    message: string,
    error: string

}


export interface usuario{
    usuario: Usuario,
    token: string,
    refreshToken: string
}

export interface Usuario{

    name: string,
    userName: string,
    email: string,
    password: string,
    createdOn: string,
    createdBy: string,
    updatedOn: string,
    updatedBy: string,
    isDeleted: boolean,
    isActive: boolean,
    id: number,
    domainEvents: any[];
    empresaId?: number,
    tipo?:  number

}