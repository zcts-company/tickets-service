const mainPathLocalWindows:string = "D:/tickets/files/nemo/"
const mainPathDocker:string = "/tmp/tickets/files/nemo/"
const path:string = mainPathDocker

export const config = {
    name:"Nemo travel ticket service",

    checkUpdates:true,

    intervalSending:5, // interval seconds
    
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
        directory:"/test/nemo1C/",
        user: "svc-newonline-aeroex",
        password: "Xvdf5@2gd",
        domain: "zcts"
    },
    suppliers:["AEROFLOTNDC"],
    permitedStatuses:["ticket","cancelled","refunded","exchanged"]

}