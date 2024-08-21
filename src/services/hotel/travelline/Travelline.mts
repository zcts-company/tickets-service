
import express from "express";
import { HotelCache } from "../../../common/cache/HotelCache.mjs";
import { fileConverterXml, fileService, hotelCacheTravelline} from "../../../instances/services.mjs";
import { toDateForSQL } from "../../../util/dateFunction.mjs";
import { HotelServiceDb } from "../../database/HotelServiceDb.mjs";
import { HotelService } from "../interfaces/HotelService.mjs";
import { HotelWebService } from "../interfaces/HotelWebService.mjs";
//import config from "./config/config_old.mjs"
import { TravellineTransport } from "./transport-service/TravellineTransport.mjs";
import { BookingResponse } from "./types/BookingResponse.mjs";
import { TravellineWebService } from "./web-service/TravellineWebService.mjs";
import cors from "cors";
import bodyParser from "body-parser";
import { HotelServer } from "../interfaces/HotelServer.mjs";
import errorHandler from "../../../common/middleware/errorHandler.mjs";
import { handService } from "./router/HandService.mjs";
import { logger } from "../../../common/logging/Logger.mjs";
import config from "../../../config/hotel/travelline.json" assert {type: 'json'}
import mainConf from "../../../config/main-config.json" assert {type: 'json'}
import { RoomStay } from "./types/RoomStay.mjs";
import { symbol } from "joi";

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
    private beginCheckDate:Date;

    constructor(){
        this.server = express();
        this.server.use(cors())
        this.server.use(bodyParser.urlencoded({extended: true}));
        this.server.use(bodyParser.json());

        this.database = new HotelServiceDb(config.database.orders,hotelCacheTravelline,config.checkUpdates);
        this.webService = new TravellineWebService();
        this.transportService = new TravellineTransport()
        this.currentDirectory = config.fileOutput.mainPath
        this.arhiveDirectory = config.fileArhive.mainPath
        this.directory1C = config.directory1C.mainPath
        this.currentDate = new Date() 
        this.beginCheckDate = new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(),this.currentDate.getDate(),0,0,0,1)
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


    async run(dateFrom: Date, dateTo: Date):Promise<void> {
        this.checkDate(dateFrom)
            logger.trace("[TRAVELLINE] run iteration for check reservation: from - " +  toDateForSQL(dateFrom) + " to - " + toDateForSQL(dateTo))  
        
        this.beginCheckDate.setDate(this.currentDate.getDate() - config.countCheckDays)   
        
        logger.trace("[TRAVELLINE] begin check date setted - " +  toDateForSQL(this.beginCheckDate));

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
        
        const reservationFromBase:HotelCache = await this.database.getReservationsByDate(this.beginCheckDate,dateTo);
        this.checkReservation(reservationFromBase.getCache()).then((list) => {
            this.requestToWebService(list)

            if(mainConf.main.transport.local){
                this.transportService.sendTo1CLocalPath(this.currentArhivePath)
            }

            if(mainConf.main.transport.smbserver){
                this.transportService.sendTo1CSamba(this.currentArhivePath);
            }

        });
        
    }

    private checkDate(dateFrom:Date){
      
        if(this.currentDate < dateFrom){
              logger.info(`[TRAVELLINE] start process of cleared cache of date ${this.currentDate} `);
              hotelCacheTravelline.clearCache()
              logger.info(`[TRAVELLINE] Cache of date ${this.currentDate} cleared`);
              logger.info(`[TRAVELLINE] rows in cache: ${Array.from(hotelCacheTravelline.getCache().keys())}`);

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
        
        for (let index = 0; index < reservationData.booking.roomStays.length; index++) {
            reservationData.booking.roomStays[index].ratePlan.description = replaceSymbols(reservationData.booking.roomStays[index].ratePlan.description)    
        }

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
            const existArchive:boolean = await this.checkAllArchives(this.beginCheckDate,fileName,this.arhiveDirectory);

            if(!existArchive){
                const existCurrent:boolean = await fileService.pathExsist(this.currentDirectory + `${fileName}.xml`)
                if (!existCurrent) {
                    result.set(arrayOfkeys[index],reservation)
                }
            }
        }

        return result;
    }

    private async checkAllArchives(beginDate:Date,filename:String, mainArchiveDirectory:string):Promise<boolean>{
        let startDate:Date = new Date(beginDate)
        let exist:boolean = false;
        while(startDate < this.currentDate && !exist){
            try {
                logger.trace(`[TRAVELLINE] start checking exist of file: ${filename}.xml`)
                const archivePath = `${mainArchiveDirectory}${startDate.toLocaleDateString().replace(new RegExp('[./]', 'g'),"-")}/`;
                exist = await fileService.pathExsist(archivePath + `${filename}.xml`);
                if(exist){
                    logger.trace(`[TRAVELLINE] file: ${filename}.xml exist in directory: ${archivePath}`)
                }
                startDate.setDate(startDate.getDate() + 1)
            } catch (error) {
                logger.error(`[TRAVELLINE] ERROR CHECK ARHIVE: ${error}`)
            }
           
        }

        return exist;
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


function replaceSymbols(description: string): string {
        description = description.replace(/<[^>]*>/g, ''); 
        description = description.replace(/[\n\b\&nbsp\&amp]/g, '');  
    return description;   
}

//"<p><b>Правила и ограничения</b></p>\n<p><u>Налоги</u></p>\n<p>В стоимость номера входят все налоги и местные сборы.</p>\n<p><u>Политика предоставления гарантий</u></p>\n<p>Для осуществления данного бронирования требуется кредитная карта. Если для регистрации вы используете дебетовую/кредитную карту, отель оставляет за собой право заблокировать полную предварительную стоимость заказа, включая непредвиденные расходы, до даты выписки; данная сумма может оставаться заблокированной в течение 72&nbsp;часов с даты выписки или дольше на усмотрение эмитента карты.</p>\n<p><u>Правила отмены</u></p>\n<p>Бесплатная отмена за 24 часа до даты и времени заезда в отель. При регистрации сотрудник стойки регистрации подтвердит дату вашей выписки. Тарифы указаны с учетом даты регистрации и продолжительности пребывания. В случае досрочной выписки цена может быть изменена.Мы оставляем за собой право отменить или изменить бронирование, если окажется, что клиент вовлечен в мошенническую или неуместную деятельность, либо в других случаях, когда бронирование содержит ошибку или выполнено по ошибке.</p>\n<p><u>Услуги, предоставляемые без дополнительной платы</u></p>\n<p>Всем гостям предоставляется бесплатный доступ к беспроводному Интернету в отеле.&nbsp;</p>"

