const mongoose = require('mongoose');
const Child = require('./Child').schema;
const User = require('./User').schema;
const Class = require('./Class').schema;

/**
 * attendance will be marked in the daily attendance report per class
 * will be sorted by class and child, when displayed, will depend on enviroment
 * when displayed in class, will sort by day and child, showing in and out times
 * when displayed for child, will show weekly, in out times and staff reporting
 */

let classAttendanceSchema = new mongoose.Schema({
    present: Boolean,
    date: Date,
    signInTime: Date,
    signOutTime: Date,
    staffMember: User,
    class: Class,
    child: Child
});

let Attendance = mongoose.model('classAttendance', classAttendanceSchema);

module.exports = Attendance;