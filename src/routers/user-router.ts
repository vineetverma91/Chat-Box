import { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import { userValidators } from '../validators/userValidators';
import { GlobalMiddleware } from '../middlewares/globalMiddleware';

export class UserRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        this.router.get('/send/verification/email', GlobalMiddleware.authenticate, UserController.resendVerificationEmail);
        this.router.get('/login',userValidators.login(),GlobalMiddleware.checkError, UserController.login);
    }

    postRoutes() {
        this.router.post('/signup', userValidators.signUp(), GlobalMiddleware.checkError, UserController.signUp);
    }

    patchRoutes() {
        this.router.patch('/verify', userValidators.verifyUser(), GlobalMiddleware.checkError, GlobalMiddleware.authenticate, UserController.verify);
    }

    deleteRoutes() {

    }
}

//initilazation of class for constructor call
export default new UserRouter().router;