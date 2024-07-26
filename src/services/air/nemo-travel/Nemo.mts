//import {config} from "./config/config.mjs" //assert { type: "json" }
import { AirServiceServer } from "../interfaces/AirServiceServer.mjs";
import express from "express";
import auth from "./midleware/Authentification.mjs";
import { service } from "./router/service.mjs";
import { FileService } from "../../../common/file-service/FileService.mjs";
import bodyParser from "body-parser";
import cors from 'cors'
import { NemoTransportService } from "./transport/NemoTransportService.mjs";
import setArchivePath from "./midleware/SetArchivePath.mjs";
import errorHandler from "../../../common/middleware/errorHandler.mjs";
import { fileService} from "../../../instances/services.mjs";
import { logger } from "../../../common/logging/Logger.mjs";
import config from "../../../config/air/nemo.json" assert {type: 'json'}
import mainConf from "../../../config/main-config.json" assert {type: 'json'}

export class Nemo implements AirServiceServer {
    
    private server:any;
    private fileService:FileService;
    private archiveDirectory:string;
    private currentDirectory:string;
    private currentArchiveDirectory:string;
    private directory1C:string;
    private transport:NemoTransportService;

    constructor(){
        this.server = express();
        this.server.use(cors())
        this.server.use(bodyParser.urlencoded({extended: true}));
        this.server.use(bodyParser.json());
        this.transport = new NemoTransportService()
        this.fileService = fileService;
        this.currentDirectory = config.fileOutput.mainPath
        this.archiveDirectory = config.fileArhive.mainPath
        this.directory1C = config.directory1C.mainPath
        this.currentArchiveDirectory = `${config.fileArhive.mainPath}${new Date().toLocaleDateString().replace(new RegExp('[./]', 'g'),"-")}/`;
    }

    getServiceName(): string {
        return config.nameService
    }
    
    async startServer(port: number): Promise<void> {
        const directoryArhiveExist:boolean = await this.fileService.pathExsist(this.archiveDirectory);
        const directoryCurrentExist:boolean = await this.fileService.pathExsist(this.currentDirectory);
        const directory1CExist:boolean = await this.fileService.pathExsist(this.directory1C);

        if(!directoryArhiveExist){
            await this.fileService.createDirectory(this.archiveDirectory)
            logger.info(`[NEMO TRAVEL] Directory created: ${this.archiveDirectory}`);
        }

        if(!directoryCurrentExist){
            await this.fileService.createDirectory(this.currentDirectory)
            logger.info(`[NEMO TRAVEL] Directory created: ${this.currentDirectory}`);
        }

        if(!directory1CExist){
            await this.fileService.createDirectory(this.directory1C)
            logger.info(`[NEMO TRAVEL] Directory created: ${this.directory1C}`);
        }
          
         this.server.listen(port,() => {
                logger.info(`[NEMO TRAVEL] Server Nemo travel tickets listening on port ${port}`);
                this.server.use(errorHandler);
         });

        this.server.use("",setArchivePath(this.currentArchiveDirectory)) 
        this.server.use("/nemo/service",service)

        setInterval(() => {
            logger.trace(`[NEMO TRAVEL] Step transport service of nemo travel`);

            if(mainConf.main.transport.local){
                this.transport.sendTo1C(this.currentArchiveDirectory)
            }

            if(mainConf.main.transport.smbserver){
                this.transport.sendTo1CSamba(this.currentArchiveDirectory)
            }
            
        },config.intervalSending * 1000)
        
    }   

     public async setCurrentArchiveDirectory(date:Date):Promise<void>{      
        // for tests
        // dateFrom = new Date(2024,4,15,0,0,0,1)
        // dateTo = new Date(2024,4,15,23,59,59,0)
        logger.info(`[NEMO TRAVEL] Server recived date from archive path: ${date.toLocaleDateString()}`);
        this.currentArchiveDirectory = `${config.fileArhive.mainPath}${date.toLocaleDateString().replace(new RegExp('[./]', 'g'),"-")}/`;
        logger.info(`[NEMO TRAVEL] Cerrent archive path setted: ${this.currentArchiveDirectory}`);
        
        const directoryArhiveExist:boolean = await this.fileService.pathExsist(this.currentArchiveDirectory);
        
        if(!directoryArhiveExist){
            await this.fileService.createDirectory(this.currentArchiveDirectory)
            logger.info(`[NEMO TRAVEL] Directory created by server methods: ${this.currentArchiveDirectory}`);
        }
    
    }
      
}