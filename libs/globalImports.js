const Student = require("../managers/entities/Student.mongoModel.js");
const School = require("../managers/entities/School.mongoModel.js");
const Classroom = require("../managers/entities/Classroom.mongoModel.js");
const User = require("../managers/entities/User.mongoModel.js");

module.exports = {
    Student,
    School,
    Classroom,
    User
}