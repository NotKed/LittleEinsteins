const Class = require('../models/Class');
const helper = require('../structure/Logger');
const Child = require('../models/Child');
const User = require('../models/User');
const moment = require('moment');
const Attendance = require('../models/Attendance');

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
        res.render('dashboard/class/class', { 
            classID: req.params.classID,
            user: req.user,
            classes: classes,
            children: children,
            users: users,
            reports: reports
        });
    });

    app.get('/admin/classAttendance/:classID', isAuthenticated, async (req, res) => {
        let classes = await Class.find().lean();
        let children = await Child.find().lean();
        let users = await User.find().lean();
        let attendanceRecords = await Attendance.find().lean();
        let reports = null;

        let attendances = {};

        // loop thorugh last 31 days using moment, find attendances for 
        // children in these days, add to 'attendances' for sorting
        // in the attendance view.
        const currentMoment = moment().subtract(31, 'days');
        while (currentMoment.isBefore(moment(), 'day')) {
            attendances[currentMoment.date()] = await Attendance.find({date: currentMoment}).lean();
            currentMoment.add(1, 'days');
        }

        res.render('dashboard/class/classAttendance', { 
            classID: req.params.classID,
            user: req.user,
            classes: classes,
            children: children,
            users: users,
            reports: reports,
            attendances: attendances
        });
    })

    app.get('/admin/editClass/:classID', isAuthenticated, async (req, res) => {
        let classes = await Class.find().lean();
        let children = await Child.find().lean();
        let users = await User.find().lean();
        let reports = null;
        res.render('dashboard/class/classEdit', { 
            classID: req.params.classID,
            user: req.user,
            classes: classes,
            children: children,
            users: users,
            reports: reports
        });
    })

    app.get('/admin/newclass', isAuthenticated, async (req, res) => {
        let classes = await Class.find().lean();
        let children = await Child.find().lean();
        let users = await User.find().lean();
        let reports = null;
        res.render('dashboard/class/newClass', { 
            user: req.user,
            classes: classes,
            children: children,
            users: users,
            reports: reports
        });
    });

    app.get('/admin/newchild', isAuthenticated, async (req, res) => {
        let classes = await Class.find().lean();
        let children = await Child.find().lean();
        let users = await User.find().lean();
        let reports = null;
        res.render('dashboard/child/newChild', { 
            user: req.user,
            classes: classes,
            children: children,
            users: users,
            reports: reports
        });
    });

    app.get('/admin/class', isAuthenticated, async (req, res) => {
        let classes = await Class.find().lean();
        let children = await Child.find().lean();
        let users = await User.find().lean();
        let reports = null;
        res.render('dashboard/class/classes', { 
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
        res.render('dashboard/child/children', {
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
        res.render('dashboard/child/child', {
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