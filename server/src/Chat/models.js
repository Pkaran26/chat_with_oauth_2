var mongoose = require('mongoose');
var schema = mongoose.Schema;

var UserSchema = ({
  username: {
    type: String,
    required: [true, 'required'],
  },
  email: {
    type: String,
    required: [true, 'required'],
  },
  imageUrl: {
    type: String,
    required: [true, 'required'],
  },
  last_seen: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

var ChatSchema = ({
  receiver: {
    type: String,
    required: [true, 'required'],
  },
  receiver_id: {
    type: schema.Types.ObjectId,
    required: [true, 'required'],
  },
  message:{
    type: String,
    required: [true, 'required'],
  },
  file: {
    name: String,
    size: String,
    data: Buffer,
    contentType: String
  },
  thumb: {
    name: String,
    size: String,
    data: Buffer,
    contentType: String
  },
  sender_id: {
    type: schema.Types.ObjectId,
    required: [true, 'required'],
  },
  datetime: {
    type: String,
    required: [true, 'required'],
  },
  message_status: {
    sent: Boolean,
    received: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = {
  user: mongoose.model('user', UserSchema),
  chat: mongoose.model('chat', ChatSchema),
}
