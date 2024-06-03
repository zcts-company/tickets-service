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
    }

}