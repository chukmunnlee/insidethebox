import { Pool } from 'mysql';

export type Query = (params?: any[]) => Promise<any>;

export function mkQuery(query: string, pool: Pool) {
    return function(params?: any[]): Promise<any> {
        return (new Promise(
            (resolve, reject) => {
                pool.getConnection((error, conn) => {
                    if (error) 
                        return (reject(error));
                    conn.query(query, params || [], 
                        (error, result) => {
                            conn.release();
                            if (error) 
                                return (reject(error));
                            resolve(result)
                        })
                })
            }
        ))
    }
}