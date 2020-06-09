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
        this.router.post('/login', UserController.login);
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