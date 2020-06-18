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
        this.router.get('/send/verification/email',userValidators.resendVerificationEmail(), UserController.resendVerificationEmail);
    }

    postRoutes() {
        this.router.post('/signup', userValidators.signUp(), GlobalMiddleware.checkError, UserController.signUp);
    }

    patchRoutes() {
        this.router.patch('/verify', userValidators.verifyUser(), GlobalMiddleware.checkError, UserController.verify);
    }

    deleteRoutes() {

    }
}

//initilazation of class for constructor call
export default new UserRouter().router;