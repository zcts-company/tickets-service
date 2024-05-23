import { HotelCache } from "../common/cache/HotelCache.mjs";
import { Nemo } from "../services/air/nemo-travel/Nemo.mjs";
import { Travelline } from "../services/hotel/travelline/Travelline.mjs";
import { TicketService} from "../services/interfaces/TicketService.mjs";
import { TicketServiceServer } from "../services/interfaces/TicketServiceServer.mjs";


export const hotelCacheTravelline:HotelCache = new HotelCache()
export const travelline:TicketService = new Travelline()
export const nemoTavelServer:TicketServiceServer = new Nemo()

export const services:TicketService[] = [travelline]