const mainPathLocalWindows:string = "D:/tickets/files/travelline/"
const mainPathDocker:string = "/tmp/tickets/files/travelline/"
const path:string = mainPathDocker

const config = {
    name:"[Travelline ticket service]",

    nameProvider:"travelline", // name provider in database

    checkUpdates:false,
    
    database:{
        orders:"corporate"
    },
    fileOutput:{
        path:`${path}current/`
    },
    fileArhive:{
        path:`${path}archive/`
    },
    directory1C:{
        path:`${path}directory1C/`
    },

    samba:{ 
        server: "//10.0.50.92/aeroexpress",
        directory:"/test/travelline1C/",
        user: "svc-newonline-aeroex",
        password: "Xvdf5@2gd",
        domain: "zcts"
    },
        
    baseUrl:"https://partner.qatl.ru/api/",
    reseration:"reservation/v1/bookings/",
    apiKey:"5be03c6d-523a-4b9e-8f55-7cf54cccb822"
}

export default config