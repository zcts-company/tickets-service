import {config} from "./config/config.mjs" //assert { type: "json" }
import { AirService } from "../interfaces/AirService.mjs";


export class Nemo implements AirService {


    run(dateFrom: Date, dateTo: Date): void {
        
        console.log(`Step nemo travel: orders from ${dateFrom.toLocaleDateString()} to ${dateTo.toLocaleString()}`);
        
    }

    getServiceName(): string {
        return config.name;
    }
    
}