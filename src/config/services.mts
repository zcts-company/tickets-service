import { HotelCache } from "../common/cache/HotelCache.mjs";
import { Nemo } from "../services/air/nemo-travel/Nemo.mjs";
import { Travelline } from "../services/hotel/travelline/Travelline.mjs";
import { TicketService} from "../services/interfaces/TicketService.mjs";
import { TicketServiceServer } from "../services/interfaces/TicketServiceServer.mjs";
import travellineConfig from "../services/hotel/travelline/config/config.mjs"
import { FileService } from "../common/file-service/FileService.mjs";
import { FileConverterXml } from "../common/converter/FileConverterXml.mjs";

export const fileService:FileService = new FileService();
export const fileConverterXml:FileConverterXml = new FileConverterXml()

export const hotelCacheTravelline:HotelCache = new HotelCache(travellineConfig.nameProvider)
export const travelline:TicketService = new Travelline()
export const travellineHandServer:TicketServiceServer = new Travelline()


export const nemoTavelServer:TicketServiceServer = new Nemo()

export const services:TicketService[] = [travelline]