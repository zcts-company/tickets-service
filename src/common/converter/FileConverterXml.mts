import { json2xml } from "xml-js";

export class FileConverterXml {

    private version;

    constructor(){

        this.version = '<xml version="1.0" encoding="utf-8">'       
        
    }


    jsonToXml(object:Object){
      const result = `${this.version}${json2xml(JSON.stringify(object),{compact:true})}`
            return result;
        }

    }
