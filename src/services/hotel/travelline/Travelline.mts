
import { HotelCache } from "../../../common/cache/HotelCache.mjs";
import { FileConverterXml } from "../../../common/converter/FileConverterXml.mjs";
import { HotelServiceDb } from "../../database/HotelServiceDb.mjs";
import { HotelService } from "../interfaces/HotelService.mjs";
import { HotelWebService } from "../interfaces/HotelWebService.mjs";
import {config} from "./config/config.mjs" //assert { type: "json" };
import { TravellineFileService } from "./file-service/TravellineFileService.mjs";
import { TravellineTransport } from "./transport-service/TravellineTransport.mjs";
import { BookingResponse } from "./types/BookingResponse.mjs";
import { TravellineWebService } from "./web-service/TravellineWebService.mjs";

export class Travelline implements HotelService{

    private database:HotelServiceDb
    private webService:HotelWebService
    private converter: FileConverterXml
    private fileService:TravellineFileService;
    private transportService:TravellineTransport;
    private currentDirectory:string
    private arhiveDirectory:string
    private currentArhivePath:string | undefined

    constructor(){
        this.database = new HotelServiceDb(config.database.orders);
        this.webService = new TravellineWebService();
        this.converter = new FileConverterXml();
        this.fileService = new TravellineFileService();
        this.transportService = new TravellineTransport()
        this.currentDirectory = config.fileOutput.path
        this.arhiveDirectory = config.fileArhive.path

    }


    getServiceName() {
        return config.name
    }


    async run(dateFrom: Date, dateTo: Date) {
        console.log(`Service ${config.name} recent request to check reservation from date ${dateFrom} to date ${dateTo}`);     
        
        this.currentArhivePath = `${this.arhiveDirectory}${dateTo.toLocaleDateString().replace(new RegExp('[./]', 'g'),"-")}/`;
        const directoryArhiveExist:boolean = await this.fileService.pathExsist(this.currentArhivePath);
        const directoryCurrentExist:boolean = await this.fileService.pathExsist(this.currentDirectory);
        
        if(!directoryArhiveExist){
            await this.fileService.createDirectory(this.currentArhivePath)
            console.log(`Directory created: ${this.currentArhivePath}`);
        }

        if(!directoryCurrentExist){
            await this.fileService.createDirectory(this.currentDirectory)
            console.log(`Directory created: ${this.currentDirectory}`);
        }
        
        const reservationFromBase:HotelCache = await this.database.getReservationsByDate(dateFrom,dateTo);
        this.checkReservation(reservationFromBase.getCache()).then((list) => {
            this.requestToWebService(list)
            this.transportService.sendTo1C(this.currentArhivePath);
        });
        
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
        const res:string = this.converter.jsonToXml(reservationData);
        const fileName = this.nameOfFile(key,updated);
        const path = `${this.currentDirectory}${fileName}.xml`
        this.fileService.writeFile(path,res).then(() => {
            
            console.log(`File with name ${fileName}.xml created in directory: ${this.currentDirectory}`);
            
        })
    }


     private async checkReservation(reservationFromBase: Map<string,any>) {
        const arrayOfkeys = Array.from(reservationFromBase.keys())
        const result: Map<string,any> = new Map();

        for (let index = 0; index < arrayOfkeys.length; index++) {
            const reservation = reservationFromBase.get(arrayOfkeys[index])
            const fileName = this.nameOfFile(arrayOfkeys[index],reservation.updated)

            const existArchive:boolean = await this.fileService.pathExsist(this.currentArhivePath + `${fileName}.xml`);
            if(!existArchive){
                const existCurrent:boolean = await this.fileService.pathExsist(this.currentDirectory + `${fileName}.xml`)
                if (!existCurrent) {
                    result.set(arrayOfkeys[index],reservation)
                }
            }
        }

        return result;
    }


    nameOfFile(key:string,updated:Date) {
        
        let dateStr:string = ''
        let timeStr:string = ''

        if(config.checkUpdates){
            dateStr = updated.toLocaleDateString().replace(new RegExp('[./]', 'g'),"_")
            timeStr = updated.toLocaleTimeString().replace(new RegExp(':', 'g'),"_")
        }
        
        
        return config.checkUpdates ? `${key}D${dateStr}T${timeStr}` : `${key}` 
    }
    
}


