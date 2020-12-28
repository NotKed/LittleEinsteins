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

        /**
         * first we find the user in question that is wanted to be editted
         * secondly we update the class the user is in, making sure to push the new user in it
         * before saving the updated version of the user, we update its class with the new version of the class (the one pushed with the new user)
         */

        let child = await Child.findOne({id: req.body.id}).lean(); // here we grab the user in question
        let oldClass = await Class.findOne({id: child.class.id}).lean(); // this is the class that the user is in 

        if (oldClass.name != req.body.class) { // if the class remains the same, we don't need to update the class
            var index; // the index of which the user is in the class' children array
            oldClass.children.forEach(async (classChild) => {
                if(classChild.id == child.id) {
                    index = oldClass.children.indexOf(classChild);
                }
            });

            oldClass.children.splice(index, 1);
            await Class.updateOne({id: oldClass.id}, {children: oldClass.children}) // remove the child from the old class
        }

        let newClass = await Class.findOne({name: req.body.class});

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

        if(child.class.id != newClass.id) { // back to the check of if the class is the same as the old one
            newClass.children.push(await Child.findOne({name: req.body.name}));
            await Class.updateOne({_id: newClass._id}, {children: newClass.children}).lean(); // if the class is not the same, we update the new class with the new user
        } 
        
        helper.log(`${req.user.username} just updated child ${child.name} (ID ${child.id})`)

        res.redirect('back');
    })

    app.post('/newchild', async (req, res) => {
        helper.log(`${req.user.username} just created a new child (${req.body.name}. ID: ${req.body.childID})`);
        var chosenClass = await Class.findOne({name: req.body.class});
        var newChild = new Child();
        newChild.id = req.body.childID;
        newChild.name = req.body.name;
        newChild.dateOfBirth = req.body.dateOfBirth;
        newChild.class = chosenClass;
        newChild.parentName = req.body.parentName;
        newChild.parentEmail = req.body.parentEmail;
        newChild.parentNumber = req.body.parentNumber;
        newChild.age = calcAge(req.body.dateOfBirth);
        newChild.address = req.body.address;
        if(req.body.notes) newChild.notes = req.body.notes;

        await Class.updateOne({name: req.body.class}, {children: chosenClass.children.push(newChild)})

        newChild.save();
        res.redirect(`/admin/children/${newChild.id}`);
    });

    app.post('/newClass', async (req, res) => {
        helper.log(`${req.user.username} just created a new class (${req.body.name}. ID: ${req.body.classID})`)
        var newClass = new Class();
        newClass.id = req.body.classID;
        newClass.name = req.body.name;
        newClass.capacity = req.body.capacity;
        newClass.description = req.body.description;
        newClass.children = [];
        newClass.age = req.body.age;
        newClass.trainingLevel = req.body.trainingLevel;

        var children = req.body.child;
        if(children) {
            for(var i = 0; i < children.length; i++) {
                let data = await Child.findOne({name: children[i]}).lean();
                newClass.children.push(data);
                await Child.updateOne({_id: data._id}, {
                    class: newClass
                });
            }
        }

        newClass.save();
        res.redirect('/admin/class');
    });

    app.post('/newchild', async (req, res) => {
        helper.log(`${req.user.username} just created a new child (${req.body.name}. ID: ${req.body.childID})`)
        var newChild = new Class();
        newChild.id = req.body.childID;
        newChild.name = req.body.name;
        newChild.dateOfBirth = req.body.dateOfBirth;
        newChild.class = await Class.findOne({name: req.body.class});
        newChild.parentName = [];
        newChild.age = req.body.age;
        newChild.trainingLevel = req.body.trainingLevel;

        var children = req.body.child;
        for(var i = 0; i < children.length; i++) {
            let data = await Child.findOne({name: children[i]}).lean();
            newClass.children.push(data);
            await Child.updateOne({_id: data._id}, {
                class: newClass
            });
        }

        newClass.save();
        res.redirect('/admin/class');
    });

    app.post('/editClass', async (req, res) => {
        helper.log(`${req.user.username} just updated class ${req.body.classID}`);
        await Class.updateOne({id: req.body.classID}, {
            name: req.body.name,
            description: req.body.description,
            capacity: req.body.capacity,
            age: req.body.age,
            trainingLevel: req.body.trainingLevel
        });
        res.redirect(`/admin/class/${req.body.classID}`);
    });

    app.get('/admin/deleteClass/:classID', async (req, res) => {
        helper.log(`${req.user.username} just deleted class ${req.params.classID}`)
        await Class.deleteOne({id: req.params.classID}).lean();
        res.redirect('back');
    })

    app.get('/admin/deleteChild/:childID', async (req, res) => {
        helper.log(`${req.user.username} just deleted child ${req.params.childID}`)

        let child = await Child.findOne({id: req.params.childID});

        let classes = await Class.find();
        classes.forEach(async (qClass) => {
            if(qClass.children.includes(child)) await Class.updateOne({id: qClass.id}, {children: qClass.children.splice(qClass.children.indexOf(child), 1)});
        });

        await Child.deleteOne({id: req.params.childID}).lean();
        let children = await Child.find();
        children.forEach(async (child) => {
            if(child.id > req.params.childID) await Child.updateOne({id: child.id}, {id: child.id-1})
        });
        res.redirect('/admin/children');
    })

}

function calcAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }