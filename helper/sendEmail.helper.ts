import nodeMailer from "nodemailer"
export const sendEmail = (email:string, subject:string, htmls:string) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SEND_MAI_EMAILL,
      pass: process.env.SEND_MAIL_PASSWORD
    }
  })
  const mailOptions = {
    from: process.env.SEND_MAI_EMAILL,
    to: email,
    subject: subject,
    html: htmls
  }
  transporter.sendMail(mailOptions)
}