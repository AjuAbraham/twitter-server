
export interface JwtUser{
    id:string
    email:string
}


export interface graphQlContext{
    user?:JwtUser
}