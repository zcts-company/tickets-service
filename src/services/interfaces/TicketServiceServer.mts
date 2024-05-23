
export interface TicketServiceServer  {
    
    startServer(port:Number):void;
    getServiceName():string;
    setCurrentArchiveDirectory(date:Date):void;

}