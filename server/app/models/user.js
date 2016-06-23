var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: Schema.Types.Mixed,
    first_name: String,
    last_name: String,
    email: String,
    timezone: Number,
    image: String,
    country: String
});

module.exports  = mongoose.model('User', UserSchema);
