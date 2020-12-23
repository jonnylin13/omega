const knex = require('knex');
require('dotenv').config();


export class Database {
    static knex: any;

    static init() {
        this.knex = knex({
            client: 'mysql',
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                schema: process.env.DB_SCHEMA
            },
            pool: { min: 0, max: 30 }
        });
    }
}
Database.init();