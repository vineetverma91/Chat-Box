import User from "../models/user";
import { Utils } from "../utils/utils";
import { NodeMailer } from "../utils/nodemailer";
import { Error } from "mongoose";
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
        const password = req.body.password;
        const verification_token = Utils.generateVerificationToken();
        // ================================================================
        // Note: Here, we send token to user email for verification purpose
        // ================================================================
        try {

            const hash = await Utils.encryptPassword(password);

            const data = {
                email: email,
                password: hash,
                username: username,
                verification_token: verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
            };
            let user = await new User(data).save();
            res.send(user);
        } catch (error) {
            console.log(error);
        }
    }

    static async verify(req) {
        const verificationToken = req.body.verification_token;
        const email = req.user.email;
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

        const email = req.user.email;
        const verification_token = Utils.generateVerificationToken();
        try {
            const user: any = await User.findOneAndUpdate({ email: email }, {
                verification_token: verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
            })
            if (user) {
                await NodeMailer.sendMail({
                    to: [user.email],
                    subject: 'Email Verification',
                    html: `<p>Hello Vineet, we sending a OTP is <b>${verification_token}</b> for check process. Thank you</p>`
                });
                res.json({ success: true })
            } else {
                throw new Error('User does not Exist');
            }
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        const password = req.query.password;
        const user = req.user;
        try {
            const result = await Utils.comparePassword({
                plainPassword: password,
                encryptPassword: user.password
            });
            if (result) {
                const token = JWT.sign({ email: user.email, user_id: user._id }, 'secret', { expiresIn: '10d' });
                res.json({ user: user, token: token });
            }
        } catch (error) {
            next(error);
        }
    }
}