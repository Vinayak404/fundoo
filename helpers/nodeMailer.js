// Setting up the NodeMailer to Send the Token to the User for authentication.
var nodemailer = require('nodemailer');
exports.sendMail = (url, email) => {
    console.log(process.env.AWS_REGION);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });
    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'reset Password',
        description: 'click on the link to reset your Fundoo password',
        text: url
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err, "error in nodeMailer!");
        } else {
            console.log(`email has been sent to ${email}` + info.response);
        }
    });
}