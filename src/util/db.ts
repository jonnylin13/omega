require('dotenv').config();
const knex = require('knex');

export class DatabaseConnection {

    static knex: any;

    static async get_num_accounts(): Promise<number> {
        let ret = await this.knex.select('count(*)').from('accounts');
        return ret;
    }

    static init() {

        this.get_num_accounts().then(num_accounts => {

            let max_pool_size = Math.ceil(0.00202020202 * num_accounts + 9.797979798);
            if (max_pool_size < 10) max_pool_size = 10;
            else if (max_pool_size > 30) max_pool_size = 30;

            this.knex = knex({
                client: 'mysql',
                connection: {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_SCHEMA
                },
                pool: { min: 0, max: max_pool_size }
            });
        });
        
    }
}
DatabaseConnection.init();