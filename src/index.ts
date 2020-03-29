import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import moment from 'moment';
import sharp from 'sharp';
import fs from 'fs';
import UserRouters from "./User/Routers";
import { UserView } from './User/Controllers';

import { ChatView } from "./Chat/Controllers";

import {
  USER_LIST, SUBMIT_MESSAGE, ATTACH_FILE,
  NEW_MESSAGE, LOGIN, SINGLE_CONVERSIONS,
  TYPING, USER_TYPING
} from "./Utils/SocketEvents";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use('/user', UserRouters);

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3005;

const filesDir = `${ __dirname }/files`;
const thumpDir = `${ __dirname }/files/thumb`;
const originalDir = `${ __dirname }/files/original`;

if (!fs.existsSync(filesDir)){
    fs.mkdirSync(filesDir);
    fs.mkdirSync(thumpDir);
    fs.mkdirSync(originalDir);
}

let connections: any = [];
const _userView = new UserView();
const _chatView = new ChatView();

let users: any = [];

io.on('connection', (socket: any) => {
  connections.push(socket);
  console.log('Connected: ', connections.length);

  socket.on('disconnect', function(data: any){
    connections.splice(connections.indexOf(socket), 1);
    users = users.filter((e: any)=>{
      return e.socket_id !== socket.id
    })
    updateUsers()
    console.log('Connected: ', connections.length);
  });

  socket.on(LOGIN, async function(payload: any, callback: Function){
    await _userView.createUser(payload.payload, function(res: any){
      users.push({
        ...res,
        message_count: 0,
        socket_id: socket.id,
        is_online: true
      })
      callback(res);
      updateUsers();
    })
  });

  const updateUsers = async ()=>{
    io.sockets.emit(USER_LIST, users);
    await _userView.userList(function(allUsers: any){
      let offlineUsers: any = [];
      for (let i = 0; i < allUsers.length; i++) {
        let j = 0;
        for (j = 0; j < users.length; j++) {
          if(users[j]._id.toString() == allUsers[i]._id.toString()){
            break
          }
        }
        if(j == users.length){
          offlineUsers = [...offlineUsers, {
            ...allUsers[i],
            message_count: 0,
            socket_id: '',
            is_online: false
          }]
        }
      }
      io.sockets.emit(USER_LIST, [...users, ...offlineUsers]);
    })
    .catch((err: any)=>{});
  }

  socket.on(SUBMIT_MESSAGE, async function(payload: any, callback: Function){
    await _chatView.submitMessage(payload.message, function(res: any){
      if(payload.receiver_socket_id){
        io.to(`${payload.receiver_socket_id}`).emit(NEW_MESSAGE, payload.message);
      }
      callback(res.ops[0]);
    })
  });

  socket.on(ATTACH_FILE, async function(payload: any){
    const files = payload.message.files;
    for (let i = 0; i < files.length; i++) {
      fs.writeFile(`${ originalDir }/${ files[i].name }`, files[i].data, function(err: any) {
        if(err){
          //continue;
        }
        sharp(`${ originalDir }/${ files[i].name }`)
        .resize({ height: 300, width: 400 })
        .toFile(`${ thumpDir }/thumb_${ files[i].name }`)
        .then( async function(newFileInfo: any) {
          files[i].data = `${ files[i].name }`
          files[i].thumb = `thumb_${ files[i].name }`
          const newPayload = {
            msg_from: payload.message.msg_from,
            msg_to: payload.message.msg_to,
            file: files[i],
            created_at: moment().format('YYYY-MM-DD')
          }
          await _chatView.submitMessage(newPayload, function(res: any){
            if(payload.receiver_socket_id){
              io.to(`${payload.receiver_socket_id}`).emit(NEW_MESSAGE, res.ops[0]);
            }
            if(payload.sender_socket_id){
              io.to(`${payload.sender_socket_id}`).emit(NEW_MESSAGE, res.ops[0]);
            }
          })
        })
        .catch(function(err: any) {
          //continue;
        });
      });
    }
  });

  socket.on(TYPING, function(payload: any){
    io.to(`${payload.receiver_socket_id}`).emit(USER_TYPING, payload.typing);
  });

  socket.on(SINGLE_CONVERSIONS, async function(payload: any, callback: Function){
    await _chatView.getSingleConversationS(payload.msg_from, payload.msg_to, function(res: any){
      callback(res);
    })
  });

});

app.get('/thumb/:name', function(req: Request, res: Response) {
  res.sendFile(`${ __dirname }/files/thumb/${ req.params.name }`)
});

app.get('/file/:name', function(req: Request, res: Response) {
  res.sendFile(`${ __dirname }/files/original/${ req.params.name }`)
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
