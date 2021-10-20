const { Schema, model, Types } = require('mongoose');

let schema = new Schema([{
    chatId: { type: String, required: true, ref: 'Chat' },
    body: { type: String, required: true },
    senderId: { type: String, required: true }
}]);

module.exports = model('Messages', schema);