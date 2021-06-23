"use strict";

// const { mail } = require('../../keys');
const { providers } = require('./providers')
const nodemailer = require("nodemailer");

function createTransporter(provider) {
    let transporter = nodemailer.createTransport({
        host: provider.host,
        port: provider.port,
        secure: provider.secure, // true for 465, false for other ports
        auth: {
            user: provider.user, // generated ethereal user
            pass: provider.pass, // generated ethereal password
        },
    });
    return transporter;
}

// async..await is not allowed in global scope, must use a wrapper
async function main(mailConfig) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();
    let provider = providers.sendgrid;
    // create reusable transporter object using the default SMTP transport
    let transporter = createTransporter(provider);

    let mailOptions = {
        from: provider.sender,
        to: mailConfig.to,
        subject: mailConfig.subject,
        text: mailConfig.text,
        html: mailConfig.html
    }

    // console.log(mailOptions)

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
}

module.exports = {
    sendMail(mail) {
        main(mail).catch(console.error);
    }
}
