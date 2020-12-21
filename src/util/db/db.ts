require('dotenv').config();
const knex = require('knex');


export enum SQLErrorType {
    NO_RESULTS_FOUND
}

export class SQLError extends Error {
    type: SQLErrorType;
    constructor(error: string, type: SQLErrorType = SQLErrorType.NO_RESULTS_FOUND) {
        super(error);
        this.type = type;
    }
}

export class DatabaseConnection {

    static knex: any;

    static async get_num_accounts(): Promise<number> {
        let ret = await this.knex.select('count(*)').from('accounts');
        return ret;
    }

    static init() {
        this.knex = knex({
            client: 'mysql',
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_SCHEMA
            },
            pool: { min: 0, max: 30 }
        });
    }
}
DatabaseConnection.init();