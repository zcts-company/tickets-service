const mainPathLocalWindows:string = "D:/tickets/files/nemo/"
const mainPathDocker:string = "/tmp/tickets/files/nemo/"

export const config = {
    name:"Nemo travel ticket service",

    checkUpdates:true,

    intervalSending:5, // interval seconds
    
    fileOutput:{
        path:`${mainPathLocalWindows}current/`
    },
    fileArhive:{
        path:`${mainPathLocalWindows}archive/`
    },
    directory1C:{
        path:`${mainPathLocalWindows}directory1C/`
    }

}