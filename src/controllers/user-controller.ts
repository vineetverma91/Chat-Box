import User from "../models/user";
export class UserController {
    // =======================================================================
    // Note: create static function for use it class name basis in other class
    // =======================================================================
    static login(req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        const user = new User({
            email: email,
            password: password
        });
        user.save().then((user)=>{
           res.send(user);
        }).catch((err)=>{
           next(err);
        });
    }
}