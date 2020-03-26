const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');

import UserRouters from "./User/Routers";
import { UserView } from './User/Controllers';

import { ChatView } from "./Chat/Controllers";

import {
  USER_LIST, SUBMIT_MESSAGE,
  USER_CONVERSATIONS, SINGLE_CONVERSIONS,
  TYPING, USER_TYPING, NOT_TYPING, USER_NOT_TYPING
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

const port = process.env.PORT || 3000;

let connections: any = [];
const _userView = new UserView();
const _chatView = new ChatView();

io.on('connection', (socket: any) => {
  connections.push(socket);
  console.log('Connected: ', connections.length);

  socket.on('disconnect', function(data: any){
    connections.splice(connections.indexOf(socket), 1);
    console.log('Connected: ', connections.length);
  });

  socket.on(USER_LIST, async function(callback: Function){
    await _userView.userList(function(users: any){
      callback(users);
    })
  });

  socket.on(SUBMIT_MESSAGE, async function(payload: any, callback: Function){
    await _chatView.submitMessage(payload, function(res: any){
      callback(res);
    })
  });

  socket.on(USER_CONVERSATIONS, async function(payload: any, callback: Function){
    const { user_id } = payload
    await _chatView.getUserConversations(user_id, function(res: any){
      callback(res);
    })
  });

  socket.on(SINGLE_CONVERSIONS, async function(payload: any, callback: Function){
    const { user_id } = payload
    await _chatView.getSingleConversationS(user_id, function(res: any){
      callback(res);
    })
  });

  socket.on(TYPING, function(payload: any, callback: Function){
    io.to(`${ payload.socket_id }`).emit(USER_TYPING, {
      typeing: true,
    });
  });

  socket.on(NOT_TYPING, function(payload: any, callback: Function){
    io.to(`${ payload.socket_id }`).emit(USER_NOT_TYPING, {
      typeing: false,
    });
  });

});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
