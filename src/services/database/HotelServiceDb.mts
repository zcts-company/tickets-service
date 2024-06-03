
import pg from "pg"
const Pool =  pg.Pool;
import {config} from "./config/db.mjs" //assert { type: "json" };;
import { HotelCache } from "../../common/cache/HotelCache.mjs";
import { toDateForSQL } from "../../util/dateFunction.mjs";
import { logger } from "../../common/logging/Logger.mjs";


export class HotelServiceDb {

    private reservationCache:HotelCache;
    private pool;
    private currentDate:Date;
    private checkUpdate:boolean;

    constructor(databaseName:string, cache:HotelCache, checkUpdate:boolean){
            this.pool = new Pool({
                user:config.login,
                password:config.password,
                database:databaseName,
                host:config.host,
                port:config.port,
                max: 2
            }) 
            this.reservationCache = cache; 
            this.currentDate = new Date() 
            this.checkUpdate = checkUpdate;
            
        }

        async getAllReservations(){
            this.pool.query('SELECT * FROM orders_type_hotel WHERE reservation notNull', async (err:any, res:any) => {
                if (err) {
                  logger.error(`[DATABASE SERVICE] ${err}`);
                  return 'Error query';
                }    
                     await this.checkAndSetReservationCache(res.rows)
                return res
              })

            return this.reservationCache;  

       }

       async getReservationsByDate(dateFrom:Date, dateTo:Date){
        let from = toDateForSQL(dateFrom)
        let to = toDateForSQL(dateTo)

        const query:string = `SELECT o.id,
                                     o.locator,
                                     o.updated,
                                     h.reservation
                              FROM orders o
                              LEFT JOIN orders_type_hotel h ON h.id = o.id
                              WHERE o.${this.checkUpdate ? 'updated' : 'created'} > '${from}' AND o.${this.checkUpdate ? 'updated' : 'created'} < '${to}' AND h.reservation notNull and o.service = '${config.service.name}'`
        logger.trace(`[DATABASE SERVICE] Starting query for database. QUERY: ${query}`)
        this.pool.query(query, async (err:any, res:any) => {
            if (err) {
              logger.error(`[DATABASE SERVICE] ${err}`)
              return 'Error query';
            }    
            
            this.checkDate(dateFrom)
                 
            
            await this.checkAndSetReservationCache(res.rows)
            
            return res
          })

        return this.reservationCache;  

    }

    private checkDate(dateFrom:Date){
      
      if(this.currentDate < dateFrom){ 
            this.currentDate = new Date(dateFrom);
      }

    }

    private async checkAndSetReservationCache(rows:any[]){
            let count:number = 0;
            rows.forEach((row) => {
              if(row.reservation.provider.includes(this.reservationCache.getProviderName())){
                
                if(row.reservation.locator){
                  const reservation = this.reservationCache.getItem(row.reservation.locator);
                    if(!reservation || (row.updated > reservation.updated) ){
                        this.reservationCache.addToCache(row.reservation.locator,row)
                        count++;
                    }
                }

              }
               
            })
            logger.info(`[DATABASE SERVICE] Date: ${toDateForSQL(this.currentDate)}. Rows from database ${rows.length} setting to cache ${count} reservation`);         
        }

    }
