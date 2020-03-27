import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import moment from 'moment';
import UserRouters from "./User/Routers";
import { UserView } from './User/Controllers';

import { ChatView } from "./Chat/Controllers";

import {
  GET_USER_LIST, USER_LIST, SUBMIT_MESSAGE, NEW_MESSAGE,
  LOGIN, USER_CONVERSATIONS, SINGLE_CONVERSIONS,
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
      console.log(e.socket_id, socket.id, e.socket_id !== socket.id);
      return e.socket_id !== socket.id
    })
    updateUsers()
    console.log('Connected: ', connections.length);
  });

  socket.on(LOGIN, async function(payload: any, callback: Function){
    await _userView.createUser(payload.payload, function(res: any){
      users.push({
        ...res,
        socket_id: socket.id,
        is_online: true
      })
      callback(res);
      updateUsers();
    })
  });

  const updateUsers = ()=>{
    io.sockets.emit(USER_LIST, users);
  }

  socket.on(GET_USER_LIST, async function(callback: Function){
    await _userView.userList(function(users: any){
      callback(users);
    })
    .catch((err: any)=>{});
  });

  socket.on(SUBMIT_MESSAGE, async function(payload: any, callback: Function){
    await _chatView.submitMessage(payload.message, function(res: any){
      io.to(`${payload.receiver_socket_id}`).emit(NEW_MESSAGE, payload.message);
      callback(res.ops[0]);
    })
  });

  socket.on(TYPING, function(payload: any){
    console.log(payload);

    io.to(`${payload.receiver_socket_id}`).emit(USER_TYPING, payload.typing);
  });

  //
  // socket.on(SUBMIT_MESSAGE, async function(payload: any, callback: Function){
  //   await _chatView.submitMessage(payload, function(res: any){
  //     callback(res);
  //   })
  // });
  //
  //
  // socket.on(USER_CONVERSATIONS, async function(payload: any, callback: Function){
  //   const { user_id } = payload
  //   await _chatView.getUserConversations(user_id, function(res: any){
  //     callback(res);
  //   })
  // });
  //
  socket.on(SINGLE_CONVERSIONS, async function(payload: any, callback: Function){
    console.log(payload);

    await _chatView.getSingleConversationS(payload.msg_from, payload.msg_to, function(res: any){
      callback(res);
    })
  });

});


server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
