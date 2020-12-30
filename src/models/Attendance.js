const mongoose = require('mongoose');
const Child = require('./Child').schema;

let classAttendanceSchema = new mongoose.Schema({
    date: Date,
    class: Child,
    attendance: Boolean
});

let Attendance = mongoose.model('classAttendance', classAttendanceSchema);

module.exports = Attendance;