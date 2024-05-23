import express, { Request, Response } from "express";
import asyncHandler from 'express-async-handler'
import auth from "../midleware/Authentification.mjs";
import { FileService } from "../../../../common/file-service/FileService.mjs";
import { FileConverterXml } from "../../../../common/converter/FileConverterXml.mjs";
import { config } from "../config/config.mjs";
import { NemoOrder } from "../model/NemoOrder.mjs";
import { validation } from "../../../../common/validation/validation.mjs";
import { nemoOrder } from "../shemas/NemoOrder.mjs";
import valid from "../midleware/valid.mjs";

export const service = express.Router();
const fileService = new FileService();
const converter:FileConverterXml = new FileConverterXml();
const currentDirectory = config.fileOutput.path

service.use(validation(nemoOrder))

service.use('',asyncHandler(
    async (req:any,res:Response,next) => {
        console.log(`[NEMO TRAVEL] Check current archive path, path of service: ${req.currentArchivePath}`);
    if(req.currentArchivePath){
        
        const directoryArhiveExist:boolean = await fileService.pathExsist(req.currentArchivePath);
        
        if(!directoryArhiveExist){
            await fileService.createDirectory(req.currentArchivePath)
            console.log(`[NEMO TRAVEL] Directory created by middlware of service: ${req.currentArchivePath}`);
        }
    } else {
        console.log(`[NEMO TRAVEL] Imposible created directory: ${req.currentArchivePath}`);
    }
        
        next()
    }
))

service.post('/create',auth(),valid,asyncHandler(async(req:any, res:Response) => {
    console.log(`[NEMO TRAVEL] Resived post request for create reservation file: ${req.body}`);

   try {
    const updated = new Date(req.body.data.lastModifiedDate);
    const fileName = nameOfFile(req.body.params.id.toString(),updated);
    const existToArchive = await fileService.pathExsist(`${req.currentArchivePath}${fileName}.xml`);
    const existToCurrent = await fileService.pathExsist(`${currentDirectory}${fileName}.xml`);

            if(!existToArchive){
                
                if(!existToCurrent){
                    const path = await createFile(req.body, res);
                    await fileService.pathExsist(path);
                    res.status(200);
                    res.send()
                    console.log(`[NEMO TRAVEL] send response to nemo server 200`);
                } else {
                    console.log(`[NEMO TRAVEL] file with name ${fileName} exists in directory ${currentDirectory}`);
                    res.status(200);
                    res.send({fileExistsToCerrent:existToCurrent})
                }

            } else {
                console.log(`[NEMO TRAVEL] file with name ${fileName} exists in directory ${req.currentArchivePath}`);
                res.status(200);
                res.send({fileExistsToArchive:existToArchive})
            }
           
   } catch (error) {
        res.status(500);
        console.log(`[NEMO TRAVEL] send response to nemo server 500`);
        res.send()
   }
  
}))


async function createFile(order:NemoOrder, response:Response) {
    const res:string = converter.jsonToXml(order);
    const updated = new Date(order.data.lastModifiedDate);
    const fileName = nameOfFile(order.params.id.toString(),updated);
    const path = `${currentDirectory}${fileName}.xml`
    fileService.writeFile(path,res).then(() => {
        
        console.log(`[NEMO TRAVEL] File with name ${fileName}.xml created in directory: ${currentDirectory}`);
        
    })

    return path;
}

function nameOfFile(key:string,updated:Date) {
        
    let dateStr:string = ''
    let timeStr:string = ''

    if(config.checkUpdates){
        dateStr = updated.toLocaleDateString().replace(new RegExp('[./]', 'g'),"_")
        timeStr = updated.toLocaleTimeString().replace(new RegExp(':', 'g'),"_")
    }
    
    
    return config.checkUpdates ? `${key}D${dateStr}T${timeStr}` : `${key}` 
}


