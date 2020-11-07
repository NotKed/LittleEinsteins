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

const app = express();

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

app.use(passport.initialize());
app.use(passport.session());

async function ready() {

    console.log("-------------------------------------------------------------------------------------------------");
    console.log(chalk.green(figlet.textSync('Little Einsteins', { horizontalLayout: 'full' })));
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