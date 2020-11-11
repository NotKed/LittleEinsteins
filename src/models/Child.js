const mongoose = require('mongoose');
const Class = require('./Class').schema;

let childSchema = new mongoose.Schema({
    id: Number,
    name: String,
    age: Number,
    class: Class,
    parentName: String,
    parentNumber: String,
    parentEmail: String,
    address: String,
    dateOfBirth: String,
    registered: Date
});

let Child = mongoose.model('kid', childSchema);

module.exports = Child;