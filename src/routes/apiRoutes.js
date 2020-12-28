const ContactForm = require('../models/ContactForm');
const moment = require('moment');
const nodemailer = require('nodemailer');
const Class = require('../models/Class');
const helper = require('../structure/Logger');
const Child = require('../models/Child');
const User = require('../models/User');

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

    app.post('/updatechild', async (req, res) => {
        let child = await Child.findOne({id: req.body.id}).lean();
        let newClass = await Class.findOne({name: req.body.class}).lean();

        let oldClass = await Class.findOne({name: child.class.name}).lean();
        oldClass.children.pop(child);

        let newChild = await Child.updateOne({id: req.body.id}, {
            name: req.body.name,
            address: req.body.address,
            parentNumber: req.body.parentNumber,
            parentName: req.body.parentName,
            parentEmail: req.body.parentEmail,
            class: newClass,
            dateOfBirth: req.body.dateOfBirth,
            age: calcAge(req.body.dateOfBirth),
            notes: req.body.notes
        });

        newClass.children.push(newChild);
        
        console.log(req.body);
        res.redirect('back');
    })

    app.post('/newclass', async (req, res) => {
        console.log(req.body)
        res.redirect('/admin/class');
    });

}

function calcAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }