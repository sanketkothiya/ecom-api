const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    token: { type: String, unique: true },
}, { timestamps: false });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema, 'refreshTokens');
