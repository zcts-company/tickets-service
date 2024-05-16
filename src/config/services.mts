import { Nemo } from "../services/air/nemo-travel/Nemo.mjs";
import { Travelline } from "../services/hotel/travelline/Travelline.mjs";
import { TicketService } from "../services/interfaces/TicketService.mjs";



export const travelline = new Travelline()
//export const nemo_travel = new Nemo();

export const services:TicketService[] = [travelline]