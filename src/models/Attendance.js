const mongoose = require('mongoose');
const Child = require('./Child').schema;

let attendanceSchema = new mongoose.Schema({
    date: Date,
    child: Child,
    attendance: Boolean
});

let Attendance = mongoose.model('attendance', attendanceSchema);

module.exports = Attendance;