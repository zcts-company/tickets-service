import { HotelCache } from "../common/cache/HotelCache.mjs";
import { Nemo } from "../services/air/nemo-travel/Nemo.mjs";
import { Travelline } from "../services/hotel/travelline/Travelline.mjs";
import { TicketService} from "../services/interfaces/TicketService.mjs";
import { TicketServiceServer } from "../services/interfaces/TicketServiceServer.mjs";
import travellineConfig from "../config/hotel/travelline.json" assert {type: 'json'}
import { FileService } from "../common/file-service/FileService.mjs";
import { FileConverterXml } from "../common/converter/FileConverterXml.mjs";
import { Ostrovok } from "../services/hotel/ostrovok/Ostrovok.mjs";

export const fileService:FileService = new FileService();
export const fileConverterXml:FileConverterXml = new FileConverterXml();

export const hotelCacheTravelline:HotelCache = new HotelCache(travellineConfig.nameProvider);
export const travelline:TicketService = new Travelline();
export const ostrovok:TicketService = new Ostrovok();
export const travellineHandServer:TicketServiceServer = new Travelline();


export const nemoTavelServer:TicketServiceServer = new Nemo();

export const services:TicketService[] = [travelline]
//export const services:TicketService[] = [ostrovok]