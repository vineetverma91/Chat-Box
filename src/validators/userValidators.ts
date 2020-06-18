import { body } from "express-validator";
import User from "../models/user";

export class userValidators {
    static signUp() {
        return [body('email', 'Email is Required').isEmail().custom((email) => {
            //console.log(req.body);
            return User.findOne({ email: email }).then(user => {
                if (user) {
                    throw new Error('User is already Exist');
                } else {
                    return true;
                }
            })
        }),
        body('password', 'Password is required field').isAlphanumeric()
            .isLength({ min: 8, max: 20 }).withMessage('Password can be from 8-20 Characters only'),
        body('username', 'Username is required').isString()];
    }

    static verifyUser() {
        return [body('verification_token', 'Verification Token is Required').isNumeric(),
        body('email', 'Email is Required').isEmail()]
    }

    static resendVerificationEmail() {
        return [body('email').isEmail()]
    }
}

// npm start -> yarn start
// npm install express -> yarn add express
// npm update express -> yarn upgrade express
// npm uninstall express -> yarn remove express
// npm install -g typescript -> yarn add global typescript
