import { HotelCache } from "../common/cache/HotelCache.mjs";
import { Nemo } from "../services/air/nemo-travel/Nemo.mjs";
import { Travelline } from "../services/hotel/travelline/Travelline.mjs";
import { TicketService} from "../services/interfaces/TicketService.mjs";
import { TicketServiceServer } from "../services/interfaces/TicketServiceServer.mjs";
import travellineConfig from "../config/hotel/travelline.json" assert {type: 'json'}
import { FileService } from "../common/file-service/FileService.mjs";
import { FileConverterXml } from "../common/converter/FileConverterXml.mjs";
import { Ostrovok } from "../services/hotel/ostrovok/Ostrovok.mjs";
import { TravellineHotelsLoader } from "../services/hotel/travelline-hotels-loader/TravellineHotelsLoader.mjs";


//common instances
export const fileService:FileService = new FileService();
export const fileConverterXml:FileConverterXml = new FileConverterXml();

//instances with common interval
export const hotelCacheTravelline:HotelCache = new HotelCache(travellineConfig.nameProvider);
export const travelline:TicketService = new Travelline();
export const ostrovok:TicketService = new Ostrovok();

//server instances
export const travellineHandServer:TicketServiceServer = new Travelline();
export const nemoTavelServer:TicketServiceServer = new Nemo();


////instances with individual interval
export const travellineHotelsLoader:TicketService = new TravellineHotelsLoader()



export const services:TicketService[] = [travelline]
export const servicesIndividualInterval:TicketService[] = [travellineHotelsLoader]

//export const services:TicketService[] = [ostrovok]