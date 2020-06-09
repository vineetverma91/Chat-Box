export class UserController {
    // =======================================================================
    // Note: create static function for use it class name basis in other class
    // =======================================================================
    static login(req, res, next) {
        res.send(req.query);
    }

    static test(req, res, next) {
        console.log('called');
    }
}