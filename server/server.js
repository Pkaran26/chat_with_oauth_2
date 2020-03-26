const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const cors = require('cors');
const moment = require('moment');
const controllers = require('./src/Chat/controllers');
const fs = require('fs');
const sharp = require('sharp');

app.use(cors());
app.use(express.static('public'))
users = [];
connections = [];

const filesDir = './files';
const thumpDir = './files/thumb';
const originalDir = './files/original';
if (!fs.existsSync(filesDir)){
    fs.mkdirSync(filesDir);
    fs.mkdirSync(thumpDir);
    fs.mkdirSync(originalDir);
}

server.listen(process.env.PORT || 3005);
console.log('running...');

app.get('/', function(req, res){
  res.sendFile(__dirname+ '/src/index.html');
});

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: ', connections.length);

  //disconnected
  socket.on('disconnect', function(data){
    const datetime = moment();
    filterUser(socket.id, datetime);
    users.splice(connections.indexOf(socket), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Connected: ', connections.length);
  });

  function filterUser(id, datetime){
    const arr = users.filter((e, i)=>{
      return e.user_id == id;
    })
    if(arr && arr.length>0){
      try {
        controllers.updateUser(arr[0]._id, datetime, function(status){
          //console.log("status", status);
        })
      } catch (e) {

      }

    }
  }

  socket.on('NEWUSER', function(data, callback){
    controllers.createUserSocket(data, function(status){
      if(status && status.status){
        callback(status);
        socket.username = status.user.username;
        data.username = status.user.username;
        data._id = status.user._id;
        data.imageUrl = status.user.imageUrl;
        users.push(data);
        updateUsernames();
      }else {
        callback(status);
      }
    })
  });

  function updateUsernames(){
    controllers.getUsersSocket(function(status){
      if(status.status){
        const finalUsers = mergeUsers(status);
        io.sockets.emit('ONLINEUSERS', finalUsers);
      }else {
        io.sockets.emit('ONLINEUSERS', users);
      }
    })
  }

  function mergeUsers(status){
    let finalUsers = [];
    status.users.map((e, i)=>{
      const filteredUser = checkOnline(e._id);
      if(filteredUser && filteredUser.length>0){
        finalUsers.push({
          _id: e._id,
          user_id: filteredUser[0].user_id,
          username: e.username,
          imageUrl: e.imageUrl,
          email: e.email,
          last_seen: e.last_seen || '',
          status: true
        })
      }else {
        finalUsers.push({
          _id: e._id,
          username: e.username,
          imageUrl: e.imageUrl,
          email: e.email,
          last_seen: e.last_seen || '',
          status: false
        })
      }

    })
    return finalUsers
  }

  function checkOnline(_id){
    const filteredUser = users.filter((e, i)=>{
      return e._id.toString() == _id.toString();
    })
    return filteredUser
  }

  socket.on('SENDMESSAGE', function(data, callback){
    data.message_status.sent = true;
    controllers.createChatSocket(data, function(status){
      if(status.status){
        data['_id'] = status.message._id;
        io.to(`${data.receiver_socket_id}`).emit('NOTTYPING', "");
        io.to(`${data.receiver_socket_id}`).emit('NEWMESSAGE', {...data, user: socket.username});
        callback({
          status: true,
          message: data
        })
      }else {
        io.to(`${data.receiver_socket_id}`).emit('NOTTYPING', "");
        callback(status)
      }
    })
  });

  socket.on('SENDFILE', function(data, callback){
    const filename = moment().format('DD-MMM-YY_hh-mm_A')+'_'+data.file.name;
    const bufferData = data.file.data;
    const payload = data;

    payload.file.name = filename;
    payload.file.data = '';
    payload.thumb.name = 'thumb_'+filename;
    payload.message = filename;
    payload.message_status.sent = true;

    fs.writeFile(`files/original/${filename}`, bufferData, function(err) {
      if(err){
        callback({
          status: err,
          err: 'File upload error',
          details: err
        })
        return console.error(err);
      }
      sharp(`files/original/${filename}`).resize({ height: 300, width: 400 }).toFile(`files/thumb/thumb_${filename}`)
      .then(function(newFileInfo) {
        controllers.createChatSocket(payload, function(status){
          if(status.status && status.message && status.message._id){
            payload['_id'] = status.message._id;
            io.to(`${data.receiver_socket_id}`).emit('NEWMESSAGE', {...payload, user: socket.username});
            callback({
              status: true,
              message: payload
            });
          }else {
            callback(status)
          }
        })
      })
      .catch(function(err) {
        callback({
          status: error,
          err: 'File upload error',
          details: err
        })
      });
    });
  });

  app.get('/download/:folder/:filename', function(req, res){
    const file = `files/${req.params.folder}/${req.params.filename}`;
    res.download(file); // Set disposition and send it.
  });

  socket.on('RECEIVED_SENDER_MESSAGE', function(data){
    controllers.updateMessageSeen(data.ids, function(status){
      if(status.status){
        io.to(`${data.receiver_socket_id}`).emit('RECEIVED_MESSAGE', {
          ...data,
          status: true,
        })
      }else {
        console.log("status", status);
      }
    })
  })

  socket.on('USERTYPING', function(data){
    io.to(`${data.receiver_id}`).emit('TYPING', " is typing...");
  });

  socket.on('USERNOTTYPING', function(data){
    io.to(`${data.receiver_id}`).emit('NOTTYPING', "");
  });
});
