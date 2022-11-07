const mongoose = require("mongoose");
const { Schema } = mongoose;

const exerciseSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: String
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);