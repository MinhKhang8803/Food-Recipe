const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    reason: { type: String, required: true },
    banDuration: { type: String, required: true }, 
    bannedAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Ban', banSchema);
