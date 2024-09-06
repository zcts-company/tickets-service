import { HotelService } from "../interfaces/HotelService.mjs";
import config from "../../../config/hotel/travellineHotelsLoader.json" assert {type: 'json'}
import { logger } from "../../../common/logging/Logger.mjs";

export class TravellineHotelsLoader implements HotelService {
    
    
    run(dateFrom: Date, dateTo: Date): void {
       logger.info(`[${this.getServiceName()}] step individual interval`)
    }
    getServiceName(): string {
        return config.name;
    }
    
}