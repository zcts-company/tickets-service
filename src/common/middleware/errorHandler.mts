import { Request, Response } from "express";
import { ErrorType } from "../types/ErrorType.mjs";

export default function errorHandler(err:any,req:Request,res:Response,next:any) {
    // if(!res.statusCode||res.statusCode < 400){
    //     res.status(500);
    // }

    res.status(res.statusCode ? res.statusCode : 200);
    const errorResponse:ErrorType = {
        status:res.statusCode,
        description: typeof err === 'string' ? err : err.toString()
    }
    
    res.send(errorResponse);
}