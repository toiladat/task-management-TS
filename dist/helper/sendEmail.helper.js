"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (email, subject, htmls) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SEND_MAI_EMAILL,
            pass: process.env.SEND_MAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.SEND_MAI_EMAILL,
        to: email,
        subject: subject,
        html: htmls
    };
    transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
