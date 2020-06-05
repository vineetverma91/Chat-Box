export class UserController {
    // =======================================================================
    // Note: create static function for use it class name basis in other class
    // =======================================================================
    static login(req, res) {
       res.send('we are here to login');
    }
}