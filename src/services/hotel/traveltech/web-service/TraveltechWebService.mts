import { HotelWebService } from "../../interfaces/HotelWebService.mjs";
import { LoadRequest } from "../types/LoadRequest";
import config from "../../../../config/hotel/traveltech.json" assert {type: 'json'}
import { LoadResponse } from "../types/response/LoadResponse";
import { logger } from "../../../../common/logging/Logger.mjs";
import { LoadListRequest } from "../types/LoadListRequest";
import { ListResponse } from "../types/response_list/ListResponse";


export class TraveltechWebService implements HotelWebService {


    async getOrder(locator:string): Promise<LoadResponse|undefined>{
        let data:LoadResponse|undefined = undefined;
        try {
            const url = `${config.baseUrl}${config.reseration}`
            logger.info(`Get request to ${url}`)

            const request:LoadRequest = {
                                            lang:"ru",
                                            id:Number(locator)
                                        }

            const response = await fetch(url, {
                    method:'POST',
                    headers:{
                        'x-auth':config.apiKey,
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(request)
                })
            logger.info(`Response status: ${response.status}`)
            if(response.status == 200){
                data = await response.json() as LoadResponse;
                logger.info(`Response body:`)
                logger.info(data)
            }
       } catch (error) {
            logger.error(`Error request to traveltech reservation: ${error}`)
       } finally {
            logger.info(`Return reservation:`)
            logger.info(data)
            return data
       }    

     }

    async getOrders(fromDate: Date, toDate: Date, pageNumber: number): Promise<any> {
            let data:ListResponse = this.getEmptyListResponce();
        try {
            const url = `${config.baseUrl}${config.reserationList}`
            logger.trace(`Get request to ${url}`)

            const request:LoadListRequest = {
                    lang:"ru",
                    createdFrom:fromDate,
                    createdTo:toDate,
                    pageNumber:pageNumber,
                    pageSize:50
            }

            const response = await fetch(url, {
                    method:'POST',
                    headers:{
                        'x-auth':config.apiKey,
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(request)
                })
            logger.trace(`Response status: ${response.status}`)
            if(response.status == 200){
                data = await response.json() as ListResponse;
                logger.trace(data)
            }
       } catch (error) {
            logger.error(`Error request to traveltech reservation: ${error}`)
       } finally {
            logger.trace(`Return reservations:`)
            logger.trace(data)
            return data
       } 
    }

    getEmptyListResponce():ListResponse{
        
        return {
            result:{
                orders:[],
                page:1,
                size:50,
                total:0
            },
            errors:[]
        }
    }
    
}