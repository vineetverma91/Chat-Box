import { body, query } from "express-validator";
import User from "../models/user";
import { Error } from "mongoose";

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
        body('password', 'Password is required').isAlphanumeric().isLength({ min: 8, max: 20 }).withMessage('Password can be from 8-20 Characters only'),
        body('username', 'Username is required').isString()];
    }

    static verifyUser() {
        return [body('verification_token', 'Verification Token is Required').isNumeric()]
    }

    static resendVerificationEmail() {
        return [body('email', 'Email is Required').isEmail()]
    }

    static updatePassword() {
        return [body('password', 'Password is Required').isAlphanumeric(),
        body('confirm_password','Confirm Password is Required').isAlphanumeric(),
        body('new_password','New Password is Required').isAlphanumeric()
        .custom((newPassword, {req}) => {
           if (newPassword === req.body.confirm_password) {
               return true;
           } else {
               req.errorStatus = 422;
               throw new Error("Password and Confirm Password Does Not Match");
           }
        })]
    }

    static login() {
        return [query('email', 'Email is Required').isEmail()
            .custom((email, { req }) => {
                return User.findOne({ email: email }).then(user => {
                    if (user) {
                        req.user = user;
                        return true;
                    } else {
                        throw new Error('User does not Exist');
                    }
                });
            }),
        query('password', 'Password is required').isAlphanumeric().isLength({ min: 8, max: 20 }).withMessage('Password can be from 8-20 Characters only')]
    }
}

// npm start -> yarn start
// npm install express -> yarn add express
// npm update express -> yarn upgrade express
// npm uninstall express -> yarn remove express
// npm install -g typescript -> yarn add global typescript
