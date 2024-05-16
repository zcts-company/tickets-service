import { HotelWebService } from "../../interfaces/HotelWebService.mjs"
import { BookingResponse } from "../types/BookingResponse.mjs"
import {config} from "../config/config.mjs" //assert { type: "json" };;

export class TravellineWebService implements HotelWebService {
    
    constructor() {
        
    }


     async getReservation(locator:string): Promise<BookingResponse|undefined>{
        
        let data:BookingResponse|undefined = undefined;
        const url = `${config.baseUrl}${config.reseration}${locator}`
        const response = await fetch(url,{
            method: 'get',
	        headers: {'X-API-KEY':config.apiKey}
        })

        if(response.status == 200){
            data = await response.json() as BookingResponse;
        }
        
         return data

     }

}