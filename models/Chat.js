const { Schema, model, Types } = require('mongoose');

let schema = new Schema({
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    messages: [{ type: Types.ObjectId, ref: 'Messages', default: [] }]
});

module.exports = model('Chat', schema);