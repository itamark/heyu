var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReminderSchema = new Schema({
  text: String,
  posted: {type: Date, default: Date.now},
  recurring: Boolean,
  datetime: Number,
  timezoneOffset:Number
});

module.exports = mongoose.model('Reminder', ReminderSchema);
