import { json2xml } from "xml-js";
import  xml2js, { parseStringPromise }  from "xml2js";

export class FileConverterXml {

    private version;
    private builder;

    constructor(){
        this.builder = new xml2js.Builder();
        this.version = '<?xml version="1.0" encoding="utf-8">'          
    }


    jsonToXmlOld(object:Object){
        const result = `${this.version}${json2xml(JSON.stringify(object),{compact:true})}</xml>`
            return result;
        }

    jsonToXml(object:Object){
        const result = this.builder.buildObject(object)
            return result;
        }

    async xmlToJson(string:string): Promise<Object>{
                return await parseStringPromise(string, {
        explicitArray: false,
        trim: true,
        });
    }

}
