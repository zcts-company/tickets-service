import { Request, Response } from "express";

export const valid = (req:Request,res:Response,next:any) => {

    if (!req.body) { 
        throw 'Not body exists'
    } 

    if (!req.body.validated) {
        throw 'Must be validated'
    }

    if(req.body.joiError){
        res.status(400);
        throw req.body.joiError;
    }

    console.log("[NEMO TRAVEL] validation succseful");
    res.status(200);
    
    next();
}

export default valid;