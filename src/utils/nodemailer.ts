import * as nodeMailer from 'nodemailer';
import * as SendGrid from 'nodemailer-sendgrid-transport';

export class NodeMailer {
    private static initializeTransport() {
        return nodeMailer.createTransport(SendGrid({
            auth: {
                api_key: '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'
            }
        }))
    }

    static sendMail(data:{to:[string], subject:string, html:string}) : Promise<any> {
        return NodeMailer.initializeTransport().sendMail({
           from:'vvineet187@gmail.com',
           to:data.to,
           subject:data.subject,
           html:data.html
        });
    }
}