
import pg from "pg"
const Pool =  pg.Pool;
import {config} from "./config/db.mjs" //assert { type: "json" };;
import { HotelCache } from "../../common/cache/HotelCache.mjs";
import { toDateForSQL } from "../../util/dateFunction.mjs";


export class HotelServiceDb {

    private reservationCache:HotelCache;
    private pool;
    private currentDate:Date;

    constructor(databaseName:string, cache:HotelCache){
            this.pool = new Pool({
                user:config.login,
                password:config.password,
                database:databaseName,
                host:config.docker_host, //change for place of deploy
                port:config.port,
                max: 2
            }) 
            this.reservationCache = cache; 
            this.currentDate = new Date() 
            
        }

        async getAllReservations(){
            this.pool.query('SELECT * FROM orders_type_hotel WHERE reservation notNull', async (err:any, res:any) => {
                if (err) {
                  console.error(`[DATABASE SERVICE] ${err}`);
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
        this.pool.query(`SELECT 
                            o.id,
                            o.locator,
                            o.updated,
                            h.reservation
                        FROM orders o
                        LEFT JOIN orders_type_hotel h ON h.id = o.id
                        WHERE o.updated > '${from}' AND o.updated < '${to}' AND h.reservation notNull and o.service = '${config.service.name}'`, async (err:any, res:any) => {
            if (err) {
              console.error(`[DATABASE SERVICE] ${err}`)
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
                if(row.reservation.locator){
                  const reservation = this.reservationCache.getItem(row.reservation.locator);
                    if(!reservation || (row.updated > reservation.updated) ){
                        this.reservationCache.addToCache(row.reservation.locator,row)
                        count++;
                    }
                }
            })
            console.log(`[DATABASE SERVICE] Date: ${this.currentDate}. Rows from database ${rows.length} setting to caсhe ${count} reservation`);         
        }

    }
