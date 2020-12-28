const Class = require('../models/Class');
const helper = require('../structure/Logger');
const Child = require('../models/Child');
const User = require('../models/User');
const moment = require('moment');
module.exports = function(app, passport) {
    
    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/login');
    });

    app.get('/admin', isAuthenticated, async (req, res) => {
        let classes = await Class.find().lean();
        let children = await Child.find().lean();
        let users = await User.find().lean();
        let reports = null;
        res.render('dashboard/admin', {
            user: req.user,
            classes: classes,
            children: children,
            users: users,
            reports: reports
        });
    })

    app.get('/admin/class/:classID', isAuthenticated, async (req, res) => {
        let classes = await Class.find().lean();
        let children = await Child.find().lean();
        let users = await User.find().lean();
        let reports = null;
        res.render('dashboard/class', { 
            classID: req.params.classID,
            user: req.user,
            classes: classes,
            children: children,
            users: users,
            reports: reports
        });
    })

    app.get('/admin/class', isAuthenticated, async (req, res) => {
        let classes = await Class.find().lean();
        let children = await Child.find().lean();
        let users = await User.find().lean();
        let reports = null;
        res.render('dashboard/classes', { 
            user: req.user,
            classes: classes,
            children: children,
            users: users,
            reports: reports
        });
    })

    app.get('/admin/children/', isAuthenticated, async (req, res) => {
        let classes = await Class.find().lean();
        let children = await Child.find().lean();
        let users = await User.find().lean();
        let reports = null;
        res.render('dashboard/children', {
            user: req.user,
            classes: classes,
            children: children,
            users: users,
            reports: reports
        });
    });

    app.get('/admin/children/:childID', isAuthenticated, async (req, res) => {
        let classes = await Class.find().lean();
        let children = await Child.find().lean();
        let users = await User.find().lean();
        let reports = null;
        let data = await Child.findOne({id: req.params.childID}).lean();
        res.render('dashboard/child', {
            user: req.user,
            classes: classes,
            children: children,
            users: users,
            reports: reports,
            child: data,
            moment: moment
        });
    });
}

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) next();
    else res.redirect("/login");
}