const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "9370779b26a30a", // generated ethereal user
        pass: "97aa2ce61c1a8b", // generated ethereal password
    },
    tls:{rejectUnauthorized:false}
});
module.exports= transporter;