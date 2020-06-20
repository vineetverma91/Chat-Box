import * as Bcrypt from "bcryptjs";
export class Utils {

    public MAX_TOKEN_TIME = 6000;

    static generateVerificationToken(size: number = 5) {
        let digits = '0123456789';
        let otp = '';
        for (let i = 0; i < size; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return parseInt(otp);
    }

    static encryptPassword(password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(password, 10, ((error, hash) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(hash);
                }
            }))
        })
    }

    static async comparePassword(password: { plainPassword: string, encryptPassword: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            Bcrypt.compare(password.plainPassword, password.encryptPassword, ((error, isSame) => {
                if (error) {
                    reject(error);
                } else if (!isSame) {
                    reject(new Error('User and Password Does Not Match'));
                } else {
                    resolve(isSame);
                }
            }))
        })
    }
}