import { Router } from 'express';
import { UserController } from '../controllers/user-controller';

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
        this.router.get('/login', UserController.login, UserController.test);
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