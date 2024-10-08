import { HotelWebService } from "../../interfaces/HotelWebService.mjs"
import { BookingResponse } from "../types/BookingResponse.mjs"
//import config from "../config/config_old.mjs" //assert { type: "json" };;
import { logger } from "../../../../common/logging/Logger.mjs";
import config from "../../../../config/hotel/travelline.json" assert {type: 'json'}
export class TravellineWebService implements HotelWebService {
    
    constructor() {
        
    }
    
    getOrders(fromDate: Date, pageNumber: number): Promise<any> {
        throw new Error("Method not implemented.");
    }

     async getReservation(locator:string): Promise<BookingResponse|undefined>{
        let data:BookingResponse|undefined = undefined;
        try {
            const url = `${config.baseUrl}${config.reseration}${locator}`
            logger.info(`Get request to ${url}`)
            const response = await fetch(url,{
                method: 'get',
                headers: {'X-API-KEY':config.apiKey}
            })
            logger.info(`Response status: ${response.status}`)
            if(response.status == 200){
                data = await response.json() as BookingResponse;
                logger.info(`Response body:`)
                logger.info(data)
            }
       } catch (error) {
            logger.error(`Error request to travelline reservation: ${error}`)
       } finally {
            logger.info(`Return reservation:`)
            logger.info(data)
            return data
       }    

     }

}