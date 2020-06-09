import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyparser from 'body-parser';
import { getEnviromentVariables } from './enviroments/env';
import userRouter, { UserRouter } from './routers/user-router';

export class Server {

    public app: express.Application = express();
    public userRouter: UserRouter;

    constructor() {
        this.setConfigurations();
        this.setRoutes();
        this.error404Handler();
        this.handleError();
    }

    // ============================================================
    // Note: here We are use single responsibilty principle concept
    // ============================================================

    setConfigurations() {
        this.connectMongodb();
        this.app.use(bodyparser.urlencoded({extended:true}))
    }

    connectMongodb() {
        const databaseUrl = getEnviromentVariables().db_url;
        mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log("Database is connect");
            }).catch((err) => {
                console.log("Database is not connected:",err);
            })
    }

    setRoutes() {
       //debugger
       this.app.use('/api/user',userRouter);
    }

    error404Handler() {
        this.app.use((req, res) => {
          res.status(404).json({
              message: 'Not Found',
              status_code: 404
          })
        });
    }

    handleError() {
        //it is special type of middle ware which is use for handle internal error of controller
        this.app.use((error,req,res,next) => {
           const errorstatus = req.errorStatus();
           res.status(errorstatus).json({
               message: error.message || 'Something Went Wrong, Please Try Again',
               status_code: errorstatus
           })
        });
    }
}