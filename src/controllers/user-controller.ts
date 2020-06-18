import User from "../models/user";
import { validationResult, body } from "express-validator";
import { Utils } from "../utils/utils";
import { NodeMailer } from "../utils/nodemailer";
import { Error } from "mongoose";

export class UserController {
    // =======================================================================
    // Note: create static function for use it class name basis in other class
    // =======================================================================
    static async signUp(req, res, next) {

        // console.log('Your OTP is ', Utils.generateVerificationToken());

        //method call for use validation result
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const verification_token = Utils.generateVerificationToken();

        const data = {
            email: email,
            password: password,
            username: username,
            verification_token: verification_token,
            verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
        };

        // ================================================================
        // Note: Here, we send token to user email for verification purpose
        // ================================================================

        try {
            let user = await new User(data).save();
            res.send(user);
            await NodeMailer.sendMail({ to: ['vvineet456@gmail.com'], subject: 'Check mail process', html: `<p>Hello Vineet, we sending a OTP is <b>${verification_token}</b> for check process. Thank you</p>` })
                .then(() => {
                    res.send('success');
                }).catch(err => {
                    next(err);
                })
        } catch (error) {
            console.log(error);
        }
    }

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
}