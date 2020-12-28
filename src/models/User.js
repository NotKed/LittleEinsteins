const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const passportLocalMognoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    admin: {
        type: Boolean,
        default: false
    },
    access: []
});

userSchema.pre('save', function(next) {
    var user = this;
    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if(err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.verifyPassword = async function (candidatePassword) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if(err) throw err;
        return isMatch;
    })
}

userSchema.plugin(passportLocalMognoose);
let User = mongoose.model('user', userSchema);

module.exports = User;