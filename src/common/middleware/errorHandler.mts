import { NextFunction, Request, Response } from "express";
import { ErrorType } from "../types/ErrorType.mjs";

export default function errorHandler(err:any,req:Request,res:Response,next:NextFunction) {

    res.status(err.statusCode || 500);
    const errorResponse:ErrorType = {
        status:res.statusCode,
        description: typeof err === 'string' ? err : err.toString()
    }
    
    res.send(errorResponse);
}