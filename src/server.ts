import * as express from 'express';
import * as mongoose from 'mongoose';
import { getEnviromentVariables } from './enviroments/env';

export class Server {

    public app: express.Application = express();

    constructor() {
        this.setConfigurations();
        this.setRoutes();
    }

    // ============================================================
    // Note: here We are use single responsibilty principle concept
    // ============================================================

    setConfigurations() {
        this.setMongodb();
    }

    setMongodb() {
        const databaseUrl = getEnviromentVariables().db_url;
        mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log("Connect");
            }).catch(() => {
                console.error("Not Connected");
            })
    }

    setRoutes() {

    }
}