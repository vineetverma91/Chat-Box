import User from "../models/user";
import { validationResult, body } from "express-validator";
import { Utils } from "../utils/utils";

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

        const data = {
            email: email,
            password: password,
            username: username,
            verification_token: Utils.generateVerificationToken(),
            verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
        };

        // ================================================================
        // Note: Here, we send token to user email for verification purpose
        // ================================================================

        try {
            let user = await new User(data).save();
            // Send Verification Email
            res.send(user);
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
}