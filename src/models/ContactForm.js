const mongoose = require('mongoose');

let contactFormSchema = new mongoose.Schema({
    email: String,
    message: String,
    timeCreated: String,
    emailID: String
});

module.exports = mongoose.model('contactForm', contactFormSchema);