import fs from "fs-extra"
import {config} from "../config/config.mjs" //assert { type: "json" };
import { logger } from "../../../../common/logging/Logger.mjs"


export class TravellineTransport {

    private currentDirectory:string
    private directory1C:string
    
    constructor(){
        this.currentDirectory = config.fileOutput.path
        this.directory1C= config.directory1C.path
    }



    async sendTo1C(currentArchive:string|undefined){
       if(currentArchive){
            const files: string[] = await fs.readdir(this.currentDirectory)
            if(files.length > 0){
                files.forEach(async (fileName) => {
                    try{
                            await fs.copy(this.currentDirectory + fileName,this.directory1C + fileName);
                            const exists:boolean = await fs.pathExists(`${this.directory1C}${fileName}`)
                
                            if(exists){
                                logger.info(`[TRAVELLINE TRANSPORT] File ${fileName} sended to directory: ${this.directory1C}`);
                                await this.sendToArchive(currentArchive,fileName)
                            }
                    }catch {
                        logger.error(`[TRAVELLINE TRANSPORT] Directory ${this.directory1C} not exists or not available`)
                        throw new Error(`[TRAVELLINE TRANSPORT] Directory ${this.directory1C} not exists or not available`);
                        
                    }
            })
           }
               
       } 
    }




    private async sendToArchive(currentArchive:string,fileName:string){

        await fs.copy(this.currentDirectory + fileName,currentArchive + fileName);
        const exists:boolean = await fs.pathExists(`${currentArchive}${fileName}`)
        if(exists){
            logger.info(`[TRAVELLINE TRANSPORT] File ${fileName} sended to archive directory: ${currentArchive}`);
            await this.removeFileFromCurrent(fileName)
      }

    }

    private async removeFileFromCurrent(fileName:string){
       await fs.remove(`${this.currentDirectory}${fileName}`)
       const exist:boolean = await fs.pathExists(`${this.currentDirectory}${fileName}`)
            if(!exist){
                logger.info(`[TRAVELLINE TRANSPORT] File ${fileName} removed from current directory: ${this.currentDirectory}`);
            }
    }

}