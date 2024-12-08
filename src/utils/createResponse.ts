
interface ICreateResponse<T=any>{
    data: T,
    message: string ,
    error: T, 
   success: boolean
}


export function createSuccessResponse({data, message}: Pick<ICreateResponse, 'data' | 'message'>): Partial<ICreateResponse<any>>{

    return {data,message,error:null,success:true};

} 