
export interface HotelWebService {

    getReservation(locator:string):Promise<any>;

    getOrders(fromDate:Date,pageNumber:number):Promise<any>;
    
}