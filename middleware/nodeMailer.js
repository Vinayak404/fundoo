var nodemailer = require('nodemailer');
exports.sendMail = (url, email) => {
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
        subject: 'reser Password',
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