import User from "../models/user";
import { validationResult, body } from "express-validator";
import { Utils } from "../utils/utils";
import { NodeMailer } from "../utils/nodemailer";
import { Error } from "mongoose";
import * as Bcrypt from "bcryptjs";
import * as JWT from "jsonwebtoken";

export class UserController {
    // =======================================================================
    // Note: create static function for use it class name basis in other class
    // =======================================================================
    static async signUp(req, res, next) {

        // console.log('Your OTP is ', Utils.generateVerificationToken());

        //method call for use validation result
        const email = req.body.email;
        const username = req.body.username;
        const verification_token = Utils.generateVerificationToken();
        // ================================================================
        // Note: Here, we send token to user email for verification purpose
        // ================================================================
        try {

            const hash = await UserController.encryptPassword(req, res, next);

            const data = {
                email: email,
                password: hash,
                username: username,
                verification_token: verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
            };
            let user = await new User(data).save();
            res.send(user);
            await NodeMailer.sendMail({ to: ['vvineet456@gmail.com'], subject: 'Check mail process', html: `<p>Hello Vineet, we sending a OTP is <b>${verification_token}</b> for check process. Thank you</p>` })
                .then(() => {
                    res.send('success');
                }).catch(err => {
                    next(err);
                })

            // await Bcrypt.hash(password, 10, (async (error, hash) => {
            //     if (error) {
            //         return next(error);
            //     } else {
            //     }
            // }))
        } catch (error) {
            console.log(error);
        }
    }

    private static async encryptPassword(req, res, next) {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(req.body.password, 10, (error, hash) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(hash);
                }
            })
        })
    }

    // static async test(req, res, next) {
    //     const email = req.query.email;
    //     const password = req.query.password;

    //     await User.findOne({ email: email }).then((user: any) => {
    //         Bcrypt.compare(password, user.password, ((error, same) => {
    //             res.send(same);
    //         }))
    //     })
    // }

    static async verify(req, res, next) {
        const verificationToken = req.body.verification_token;
        const email = req.body.email;
        try {
            const user = await User.findOneAndUpdate({
                email: email, verification_token: verificationToken,
                verification_token_time: { $gt: Date.now() }
            }, { verified: true }, { new: true });
            if (user) {
                console.log(user);
            } else {
                throw new Error('Verification Token is expired. Please request for a new one');
            }
        } catch (error) {
            console.log(error);
        }
    }

    static async resendVerificationEmail(req, res, next) {

        const email = req.query.email;
        const verification_token = Utils.generateVerificationToken();
        try {
            const user: any = await User.findOneAndUpdate({ email: email }, {
                verification_token: verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
            })
            if (user) {
                const mailer = await NodeMailer.sendMail({
                    to: [user.email],
                    subject: 'Email Verification',
                    html: `<p>For email verification, we sending a OTP ${verification_token}</p>`
                })
                res.send({ success: true })
            } else {
                throw new Error('User does not Exist');
            }
        } catch (error) {
            next(error);
        }
    }

    static login(req, res, next) {
        const email = req.query.email;
        const password = req.query.password;
        Bcrypt.compare(password, req.user.password, ((error, isValid) => {
            if (error) {
                next(new Error(error.message));
            } else if (!isValid) {
                next(new Error('Email and Password Does Not Match'));
            } else {
                const data = {
                    user_id: req.user._id,
                    email: req.user.email
                };
                // here wee are using JWT for authentication purpose
                const token = JWT.sign(data, 'secret', { expiresIn: '10d' });
                res.json({
                    token: token,
                    user: req.user
                })
                // res.send(req.user);
            }
        }));
    }
}