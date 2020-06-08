const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  createdAt: { type: Date },
  permlink: { type: String },
  title: { type: String },
  body: { type: String },
});

module.exports = { postSchema };
