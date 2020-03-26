const models = require('./models');
const mongoose = require('../Utils/DBConnection');
const moment = require('moment');

const updateUser = (id, datetime, callback)=>{
  models.user.updateOne({_id: id}, {last_seen: datetime}, {new: true}, (err, user)=>{
    if(err){
      callback(false)
    }else {
      callback(true)
    }
  })
}

const updateMessageSeen = (ids, callback)=>{
  models.chat.updateMany({_id: { $in: ids } }, {"message_status.received": true}, {multi: true}, (err, chats)=>{
    if(err){
      callback({
        status: false,
        error: err
      })
    }else {
      callback({
        status: true
      })
    }
  })
}

const createUserSocket = (data, callback)=>{
  models.user.find({email: data.email}, (err, user)=>{
    if(err){
      callback({
        err: err,
        status: false
      });
    }else {
      if(user && user.length>0){
        callback({
          user: user[0],
          status: true
        })
      }else {
        let user = models.user(data);
        user.save((err, model)=>{
          if(err){
            callback({
              err: err,
              status: false
            });
          }else {
            callback({
              user: user,
              status: true
            })
          }
        })
      }
    }
  })
}

const loginUserSocket = (data, callback)=>{
  models.user.find({email: data.email, password: data.password}, (err, user)=>{
    if(err){
      callback({
        err: err,
        status: false
      });
    }else {
      if(user && user.length>0){
        callback({
          status: true,
          user: {
            _id: user[0]._id,
            username: user[0].username,
            email: user[0].email
          }
        });
      }else {
        callback({
          err: 'not found',
          status: false
        });
      }
    }
  })
}

const getUsersSocket = (callback)=>{
  models.user.find({}, (err, users)=>{
    if(err){
      callback({
        status: false,
        err: err
      })
    }else {
      callback({
        status: true,
        users: users
      })
    }
  })
}

const createChatSocket = (data, callback)=>{
  let chat = models.chat(data);
  chat.save((err, model)=>{
    if(err){
      callback({
        err: err,
        status: false
      })
    }else {
      callback({
        message: model,
        status: true
      })
    }
  })
}

const getFileSocket = (id, callback)=>{
  models.chat.find({_id: id})
  .select({file: 1})
  .exec((err, messages)=>{
    if(err){
      callback({
        status: false,
        error: err
      })
    }else {
      callback({
        status: true,
        messages: messages[0]
      })
    }
  })
}

module.exports = {
  updateMessageSeen: updateMessageSeen,
  createUserSocket: createUserSocket,
  loginUserSocket: loginUserSocket,
  getUsersSocket: getUsersSocket,
  createChatSocket: createChatSocket,
  getFileSocket: getFileSocket,
}
