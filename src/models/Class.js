const mongoose = require('mongoose');

let classSchema = new mongoose.Schema({
    id: Number,
    name: String,
    capacity: Number,
    description: String,
    children: [],
    age: Number,
    trainingLevel: String
});

let Class = mongoose.model('class', classSchema);

module.exports = Class;