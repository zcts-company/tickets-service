
export interface HotelWebService {

    getOrder(locator:string):Promise<any>;

    getOrders(fromDate:Date, toDate:Date, pageNumber:number):Promise<any>;
    
}