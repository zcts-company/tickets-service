
import express from "express";
import { HotelCache } from "../../../common/cache/HotelCache.mjs";
import { fileConverterXml, fileService, hotelCacheTravelline} from "../../../config/services.mjs";
import { toDateForSQL } from "../../../util/dateFunction.mjs";
import { HotelServiceDb } from "../../database/HotelServiceDb.mjs";
import { HotelService } from "../interfaces/HotelService.mjs";
import { HotelWebService } from "../interfaces/HotelWebService.mjs";
import config from "./config/config.mjs"
import { TravellineTransport } from "./transport-service/TravellineTransport.mjs";
import { BookingResponse } from "./types/BookingResponse.mjs";
import { TravellineWebService } from "./web-service/TravellineWebService.mjs";
import cors from "cors";
import bodyParser from "body-parser";
import { HotelServer } from "../interfaces/HotelServer.mjs";
import errorHandler from "../../../common/middleware/errorHandler.mjs";
import { handService } from "./router/HandService.mjs";
import { logger } from "../../../common/logging/Logger.mjs";

export class Travelline implements HotelService,HotelServer{

    private server:any;
    private database:HotelServiceDb
    private webService:HotelWebService
    private transportService:TravellineTransport;
    private currentDirectory:string
    private arhiveDirectory:string
    private currentArhivePath:string | undefined
    private directory1C:string
    private currentDate:Date;

    constructor(){
        this.server = express();
        this.server.use(cors())
        this.server.use(bodyParser.urlencoded({extended: true}));
        this.server.use(bodyParser.json());

        this.database = new HotelServiceDb(config.database.orders,hotelCacheTravelline,config.checkUpdates);
        this.webService = new TravellineWebService();
        this.transportService = new TravellineTransport()
        this.currentDirectory = config.fileOutput.path
        this.arhiveDirectory = config.fileArhive.path
        this.directory1C = config.directory1C.path
        this.currentDate = new Date() 
        logger.info(`[TRAVELLINE] Service ${config.name} created instance and started. Date: ${toDateForSQL(this.currentDate)}`);
    }
    startServer(port: Number): void {

        this.server.listen(port,() => {
            logger.info(`[TRAVELLINE] Server travelline hand tickets listening on port ${port}`);
            this.server.use(errorHandler);
     });

    this.server.use("/travelline/service",handService)

        
    }
    setCurrentArchiveDirectory(date: Date): void {
        throw new Error("Method not implemented.");
    }


    getServiceName() {
        return config.name
    }


    async run(dateFrom: Date, dateTo: Date) {
        this.checkDate(dateFrom)
        logger.trace(`[TRAVELLINE] Service ${config.name} recent request to check reservation from date ${toDateForSQL(dateFrom)} to date ${toDateForSQL(dateTo)}`);     
        
        this.currentArhivePath = `${this.arhiveDirectory}${dateTo.toLocaleDateString().replace(new RegExp('[./]', 'g'),"-")}/`;
        const directoryArhiveExist:boolean = await fileService.pathExsist(this.currentArhivePath);
        const directoryCurrentExist:boolean = await fileService.pathExsist(this.currentDirectory);
        const directory1CExist:boolean = await fileService.pathExsist(this.directory1C);

        if(!directoryArhiveExist){
            await fileService.createDirectory(this.currentArhivePath)
            logger.info(`[TRAVELLINE] Directory created: ${this.currentArhivePath}`);
        }

        if(!directoryCurrentExist){
            await fileService.createDirectory(this.currentDirectory)
            logger.info(`[TRAVELLINE] Directory created: ${this.currentDirectory}`);
        }

        if(!directory1CExist){
            await fileService.createDirectory(this.directory1C)
            logger.info(`[TRAVELLINE] Directory created: ${this.directory1C}`);
        }
        
        const reservationFromBase:HotelCache = await this.database.getReservationsByDate(dateFrom,dateTo);
        this.checkReservation(reservationFromBase.getCache()).then((list) => {
            this.requestToWebService(list)
            //this.transportService.sendTo1C(this.currentArhivePath);
            this.transportService.sendTo1CSamba(this.currentArhivePath);
        });
        
    }

    private checkDate(dateFrom:Date){
      
        if(this.currentDate < dateFrom){
              logger.info(`[TRAVELLINE] start process of cleared cache of date ${this.currentDate} `);
              hotelCacheTravelline.clearCache()
              logger.info(`[TRAVELLINE] Cache of date ${this.currentDate} cleared`);
              logger.info(`[TRAVELLINE] rows in cache: ${hotelCacheTravelline.getCache().keys()}`);

              this.currentDate = new Date(dateFrom);
              logger.info(`[TRAVELLINE] Current date of cache setted ${this.currentDate}`);
        }
  
      }


    requestToWebService(listReservation: Map<string, any>) {
        Array.from(listReservation.keys()).forEach(async (key) => {
            const reservation:any = listReservation.get(key);
            const locator:string = reservation.reservation.locator;
            const reservationData:BookingResponse = await this.webService.getReservation(locator);
            this.createFile(reservationData,key,reservation.updated)
        })
    }


    private createFile(reservationData: BookingResponse, key:string, updated:Date) {
        const res:string = fileConverterXml.jsonToXml(reservationData);
        const fileName = nameOfFile(key,updated);
        const path = `${this.currentDirectory}${fileName}.xml`
        fileService.writeFile(path,res).then(() => {
            
            logger.info(`[TRAVELLINE] File with name ${fileName}.xml created in directory: ${this.currentDirectory}`);
            
        })
    }


     private async checkReservation(reservationFromBase: Map<string,any>) {
        const arrayOfkeys = Array.from(reservationFromBase.keys())
        const result: Map<string,any> = new Map();

        for (let index = 0; index < arrayOfkeys.length; index++) {
            const reservation = reservationFromBase.get(arrayOfkeys[index])
            const fileName = nameOfFile(arrayOfkeys[index],reservation.updated)

            const existArchive:boolean = await fileService.pathExsist(this.currentArhivePath + `${fileName}.xml`);
            if(!existArchive){
                const existCurrent:boolean = await fileService.pathExsist(this.currentDirectory + `${fileName}.xml`)
                if (!existCurrent) {
                    result.set(arrayOfkeys[index],reservation)
                }
            }
        }

        return result;
    }

    
}

export function nameOfFile(key:string,updated:Date) {
        
    let dateStr:string = ''
    let timeStr:string = ''

    if(config.checkUpdates){
        dateStr = updated.toLocaleDateString().replace(new RegExp('[./]', 'g'),"_")
        timeStr = updated.toLocaleTimeString().replace(new RegExp(':', 'g'),"_")
    }
    
    
    return config.checkUpdates ? `${key}D${dateStr}T${timeStr}` : `${key}` 
}


