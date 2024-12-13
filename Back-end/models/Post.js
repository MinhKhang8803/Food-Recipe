// models/Post.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const postSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    image: { type: String },
    likes: { type: Number, default: 0 },
    comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);