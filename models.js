const mongoose = require('mongoose');
const { Schema } = mongoose;
require('mongoose-geojson-schema');

const communitySchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String },
  lang: { type: String },
});

const locationSchema = new mongoose.Schema({
  countryCode: { type: String },
  subdivision: { type: String },
  city: { type: String },
  coordinates: {
    type: mongoose.Schema.Types.Point,
  },
});
locationSchema.index({ coordinates: '2dsphere' });

const authorSchema = new mongoose.Schema({
  username: { type: String },
  displayName: { type: String },
  avatar: { type: String },
});

const postSchema = new Schema({
  createdAt: { type: Date },
  author: { type: authorSchema },
  permlink: { type: String },
  title: { type: String },
  location: {
    type: locationSchema,
  },
  body: { type: String },
  excerpt: { type: String },
  comments: { type: Number },
  thumbnail: { type: String },
  coverImage: { type: String },
  updatedAt: { type: Date },
  tags: { type: Array },
  wordCount: { type: Number },
  readTime: { type: Number },
  community: { type: communitySchema },
  youtubeId: { type: String },
});

module.exports = { postSchema };
