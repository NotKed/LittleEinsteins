const Class = require('../models/Class');
const helper = require('../structure/Logger');
module.exports = function(app, passport) {
    
    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/admin', isAuthenticated, (req, res) => {
        // helper.log(`${req.ip} connected the admin panel.`);
        res.render('dashboard/admin');
    })

    app.get('/admin/classes', isAuthenticated, async (req, res) => {
        let data = await Class.find().lean();
        res.render('dashboard/classes', {
            classes: data
        });
    })
}

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) next();
    else res.redirect("/login");
}