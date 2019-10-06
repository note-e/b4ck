import nodemailer from 'nodemailer';

export async function sendEmail(mailOptions: nodemailer.SendMailOptions) {
  const auth = {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  };

  mailOptions.from = `"Note-E" <${auth.user}>`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth,
  });

  transporter
    .sendMail(mailOptions)
    .then(() => console.log(`An email was sent to ${mailOptions.to}`))
    .catch(err =>
      console.error(`Failed sending email to ${mailOptions.to}
      ${err}`),
    );
}
