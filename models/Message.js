const { Schema, model, Types, models } = require('mongoose');

let schema = new Schema([{
    chatId: { type: String, required: true, ref: 'Chat' },
    body: { type: String, required: true },
    token: { type: String, required: true },
    username: { type: String, required: true }
}]);

module.exports = models.messages || model('messages', schema);