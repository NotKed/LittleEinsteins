const mongoose = require('mongoose');

let classSchema = new mongoose.Schema({
    id: Number,
    name: String,
    capacity: Number,
    children: []
});

let Class = mongoose.model('class', classSchema);

module.exports = Class;