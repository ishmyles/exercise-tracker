const mongoose = require("mongoose");
const { Schema } = mongoose;

const logSchema = {
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  log: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }]
};

module.exports = mongoose.model('Log', logSchema);