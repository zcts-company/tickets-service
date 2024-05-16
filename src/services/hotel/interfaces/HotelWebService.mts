
export interface HotelWebService {

    getReservation(locator:string):Promise<any>;
    
}