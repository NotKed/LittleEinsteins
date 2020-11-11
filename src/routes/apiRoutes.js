const ContactForm = require('../models/ContactForm');
const moment = require('moment');
const nodemailer = require('nodemailer');
const helper = require('../structure/Logger');

module.exports = function (app, passport) {
    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

    app.post('/contact', (req, res) => {
        let contactForm = new ContactForm();
        contactForm.email = req.body.email;
        contactForm.message = req.body.message;
        contactForm.timeCreated = moment();

        let transport = nodemailer.createTransport({
           host: 'mail.littleeinsteins.ie',
           port: 587,
           auth: {
               user: 'info@littleeinsteins.ie',
               pass: 'aid9789123'
           },
           tls: {rejectUnauthorized: false}
        });

        const message = {
            from: 'info@littleeinsteins.ie',
            to: 'kyleedwardsdev@gmail.com',
            subject: 'Contact Form on littleeinsteins.ie',
            text: `Contact Form on littleeinsteins.ie\nCreated on ${moment(contactForm.time).format('LLLL')}\nCreated by: ${contactForm.email}\nMessage: ${contactForm.message}`
        };

        transport.sendMail(message, (err, info) => {
            if(err) throw err;
            contactForm.emailID = info.messageId;
            contactForm.save();
        })

        res.redirect('/');
    });
}