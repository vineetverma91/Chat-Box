export class UserController {
    // =======================================================================
    // Note: create static function for use it class name basis in other class
    // =======================================================================
    static login(req, res, next) {
        const error = new Error('User does not exist');
        next();
    }

    static test(req, res, next) {
        console.log('called');
    }
}