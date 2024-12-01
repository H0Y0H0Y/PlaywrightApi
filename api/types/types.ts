export type IJSONValue = {
    [x: string]: 
        | string 
        | number 
        | boolean 
        | null 
        | Date
        | IJSONValue 
        | Buffer 
        | IJSONValue[] 
        | string[] 
        | Buffer[] 
        | IJSONValue[][] 
        | IJSONValue[][][];
}