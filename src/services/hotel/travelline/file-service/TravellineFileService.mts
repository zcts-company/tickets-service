import fs from "fs-extra"


export class TravellineFileService {

    constructor(){

    }

    async pathExsist(path:string){
        return await fs.pathExists(path)
    }

    async writeFile(path:string,data:string){
        await fs.outputFile(path,data)
    }

    async createDirectory(path:string){
        await fs.ensureDir(path);
    }

}