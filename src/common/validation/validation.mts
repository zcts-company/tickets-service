import { Request, Response } from "express";

export function validation(schema:any){

    return (req:Request,res:Response,next:any) => {

        if(schema && req.body) {
            const {error} = schema.validate(req.body);
            req.body.validated = true;
            if(error){
                req.body.joiError = error.details[0].message;
            }   
        }
        next();
    }
}