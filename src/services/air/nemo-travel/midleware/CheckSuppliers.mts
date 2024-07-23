import { NextFunction, Request, Response } from "express"
import { NemoOrder } from "../model/NemoOrder.mjs";
import {config} from "../config/config.mjs"
import { logger } from "../../../../common/logging/Logger.mjs";
import { number } from "joi";

const checkSuppliers = () => {

    return (req:Request,res:Response,next:NextFunction) => {
        logger.info(`[NEMO CHECK SUPLIERS] Start process checking supliers`)
        const body:NemoOrder = req.body;
        let counter = 1;

        const mapSuppliers:Map<number,string> = new Map();

        while(body.data.products["ID_FLT_" + counter]){
            logger.trace(`[NEMO CHECK SUPLIERS] Check product : ${JSON.stringify(body.data.products["ID_FLT_" + counter])}`)
            const supplier:string = body.data.products["ID_FLT_" + counter].info.supplier.system;
            mapSuppliers.set(counter,supplier)
            counter++;
        }

        let helperSupplier:boolean[] = []
        Array.from(mapSuppliers.values()).forEach((supplier,index) => {
              
            helperSupplier[index] = config.suppliers.includes(supplier) 

        }) 

        req.body.allSuppliersPermitted = !helperSupplier.includes(false)
        req.body.suppliers = mapSuppliers;

        logger.info(`[NEMO CHECK SUPLIERS] add supliers ${JSON.stringify(Object.fromEntries(mapSuppliers.entries()))} to body of request`)
        
        next();
    }
}

export default checkSuppliers;