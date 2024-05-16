
export class HotelCache {

    private cache:Map<string,any>;

    constructor(){
        this.cache = new Map()
    }

    getCache(){
        return new Map(this.cache);
    }

    addToCache(key:string,object:any){
        this.cache.set(key,object)
    }

    fillCache(map:Map<string,any>){
        this.cache = map;
    }

    getItem(id:string){
        return this.cache.get(id)
    }

    clearCache(){
        this.cache.clear();
    }

}