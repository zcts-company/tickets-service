const mainPathLocalWindows:string = "D:/tickets/files/travelline/"
const mainPathDocker:string = "/tmp/tickets/files/travelline/"

export const config = {
    name:"[Travelline ticket service]",

    checkUpdates:false,
    
    database:{
        orders:"corporate"
    },
    fileOutput:{
        path:`${mainPathDocker}current/`
    },
    fileArhive:{
        path:`${mainPathDocker}archive/`
    },
    directory1C:{
        path:`${mainPathDocker}directory1C/`
    },
    baseUrl:"https://partner.qatl.ru/api/",
    reseration:"reservation/v1/bookings/",
    apiKey:"5be03c6d-523a-4b9e-8f55-7cf54cccb822"
}