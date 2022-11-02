const mongoose = require('mongoose');
const { isURL } = require('validator');

const { Schema, ObjectId } = mongoose;

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (data) => isURL(data), message: 'Incorrect URL-adress',
    },
  },
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
