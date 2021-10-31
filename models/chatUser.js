const { Schema, model } = require('mongoose');

let schema = new Schema({
    token: { type: String, required: true, unique: true },
    username: { type: String, required: true },
});

module.exports = model('chatuser', schema);