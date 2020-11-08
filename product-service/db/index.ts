import {Client} from 'pg';
import {HTTPError} from "../utils";

const dbConfig = {
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
}

const dbConnect = async () => {
    try {
        const client = new Client(dbConfig);
        await client.connect();
        return client;
    } catch (err) {
        throw new HTTPError({message: 'Something went wrong with DB connection', code: 500});
    }
}

export default dbConnect;
