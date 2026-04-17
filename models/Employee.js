const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: String,
  age: Number
});

module.exports = mongoose.model('Employee', EmployeeSchema);