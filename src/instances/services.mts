import { HotelCache } from "../common/cache/HotelCache.mjs";
import { Nemo } from "../services/air/nemo-travel/Nemo.mjs";
import { Travelline } from "../services/hotel/travelline/Travelline.mjs";
import { TicketService} from "../services/interfaces/TicketService.mjs";
import { TicketServiceServer } from "../services/interfaces/TicketServiceServer.mjs";
import travellineConfig from "../config/hotel/travelline.json" assert {type: 'json'}
import { FileService } from "../common/file-service/FileService.mjs";
import { FileConverterXml } from "../common/converter/FileConverterXml.mjs";
import { Ostrovok } from "../services/hotel/ostrovok/Ostrovok.mjs";
import { Traveltech } from "../services/hotel/traveltech/Traveltech.mjs";


//common instances
export const fileService:FileService = new FileService();
export const fileConverterXml:FileConverterXml = new FileConverterXml();

//instances with common interval
export const hotelCacheTravelline:HotelCache = new HotelCache(travellineConfig.nameProvider);
export const travelline:TicketService = new Travelline();
export const traveltech:TicketService = new Traveltech()
export const ostrovok:TicketService = new Ostrovok();

//server instances
export const nemoTavelServer:TicketServiceServer = new Nemo();
export const callBackServices:TicketServiceServer[] = [nemoTavelServer]

export const services:TicketService[] = [traveltech,travelline]
export const servicesIndividualInterval:TicketService[] = []