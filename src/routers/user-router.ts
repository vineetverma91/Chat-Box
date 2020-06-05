import { Router } from 'express';

export class UserRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.pacthRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        this.router.get('/login', (req, res, next) => {
           (req as any).message = "we are here to login";
           next();
        }, (req, res)=>{
            res.send((req as any).message);
        });
    }

    postRoutes() {

    }

    pacthRoutes() {
        
    }

    deleteRoutes() {

    }
}

//initilazation of class for constructor call
export default new UserRouter().router;