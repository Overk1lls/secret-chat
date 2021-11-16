const { Schema, model, Types, models } = require('mongoose');

let schema = new Schema({
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    messages: [{ type: Types.ObjectId, ref: 'Messages', default: [] }]
});

module.exports = models.Chat || model('Chat', schema);