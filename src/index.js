/**
 * TODO: FIXME: (DONE) (IN PROGRESS)
 * 
 * TODO: 
 * - migrate to adminlte login page (DONE)
 * - remember me feature with login (DONE)
 * - add classes page (taken from AdminLTE Projects) (DONE)
 * - update class info (capacity, age to progress, stafF:child ratio, operating hours, staff training level) (DONE)
 * - setup new child and new class pages (DONE)
 * - class occupancy and projected occupancies
 * - sync class details to website home page, photos can remain static, descriptions, capacity etc can pull from db
 * - attendance records per child
 * - attendance records per class (IN PROGRESS)
 *  - make the current days attendance a form so that staff can update it on that day
 *    maybe if the user is an admin they can edit the attendance no matter what the day
 * - child reports, day to day, eating, etc.
 * - report forms, accident, e.t.c.
 * - schedules (school pickup/drop-off) 
 * - admin access management, creation of new users, managing user permissions
 * - update staff information (training level, pay, address, contact info, garda vetting, e.t.c)
 * - staff sign in and out
 * - staff rosters
 * - gallery feature, allow staff to upload photos of their class to a gallery, admin can control access
 * - migrate parent details from child to seperate model
 * - mass email, text to parents (specific groups such as classes or all parents)
 * - creche details, opening hours available on website
 * - allow website customizability through admin panel
 * - begin android app (view as a webpage instead of creating app if required)
 * - print to device (use local IPs)
 * - conversations between staff
 * - storage tracker (see whats in stock)
 * - parent log in to oversee children
 * - parents able to update childs info (require approval by admin prior to updating database)
 * - parent contact forms viewable by admin (or staff should admin decide) 
 * - parental access to certain pages (child info, class gallery, staff info (specific to class teachers))
 * - parents can start conversations with staff/admin (remove need of text messages)
 * - parents can add notes to child
 * - parents can manage child scheduele (notify of drop-off cancellation etc.)
 * - parents can manage childs hours (where occupancy is available) (admin approval required)
 * - parents able to register (to view occupancy, class informations)
 * - staff application forms online, get sent to admin(s) (apply for staff, customizable by admin)
 * - child registration online, submit instead of child application
 * - begin work on IOS app (same as android, use webpage if needed)
 * - IOS app focus on mainly parental features, staff use tablets mainly (invalid if emulating browser)
 * FIXME:
 * 
 */

const express = require('express');
const config = require('../config.json');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { readdirSync } = require('fs');
const helper = require('./structure/Logger');
const User = require('./models/User');
const session = require('express-session');
const flash = require('express-flash');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');
const chalk = require('chalk')
const figlet = require('figlet');
const Class = require('./models/Class');
const Child = require('./models/Child');
const moment = require('moment');
const Attendance = require('./models/Attendance');

const app = express();

let fileStoreOptions = {};

app.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
    store: new FileStore(fileStoreOptions),
    cookie: {
        maxAge: 24 * 60 * 60 * 365 * 1000
    }
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(express.static( __dirname + '/views/public' ));

app.use(express.json());
app.use(flash());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

passport.use(new LocalStrategy(
    async function(username, password, done) {
        let data = await User.findOne({ username: username });
        if(!data) return done(null, false, { message: 'Incorrect username.' });
        if(!data.verifyPassword(password)) return done(null, false, { message: 'Incorrect password.' });
        return done(null, data);
    }
  ));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    User.findOne({ id: id }, (err, user) => {
        if(err) return cb(err);
        cb(null, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

async function ready() {

    console.log("-------------------------------------------------------------------------------------------------");
    console.log(chalk.green(figlet.textSync('LE API', { horizontalLayout: 'full' })));
    console.log("-------------------------------------------------------------------------------------------------");
    console.log(chalk.white('-'), chalk.red("Port:"), chalk.white(config.port));
    console.log(chalk.white('-'), chalk.red("Database:"), chalk.white(config.database));
    console.log("-------------------------------------------------------------------------------------------------");

    for(dir of readdirSync('./src/routes')) {
        require(`./routes/${dir}`)(app, passport);
        helper.log(`App just loaded ${dir}`);
    }
}

mongoose.connect(`mongodb://localhost:27017/${config.database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (() => helper.log(`Connected to mongodb://localhost:27017/${config.database}`)));

app.listen(config.port, () => { ready() });