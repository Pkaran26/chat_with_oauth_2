import React, { Component } from 'react'
import OnlineUsers from './MessageArea/OnlineUsers'
import MessageArea from './MessageArea/MessageArea'

import {
  ONLINEUSERS, SENDMESSAGE, SENDFILE,
  NEWMESSAGE, USERTYPING, USERNOTTYPING,
  TYPING, NOTTYPING, RECEIVED_SENDER_MESSAGE,
  RECEIVED_MESSAGE
} from '../../SocketEvents'

class ChatContainer extends Component{
  constructor(props){
    super(props)
    this.state = {
      user: this.props.loggedUser,
      users: [],
      allMessages: [],
      messages: [],
      receiver: {}
    }
    this.socket = this.props.socket
  }

  componentDidMount(){
    this.socket.on(ONLINEUSERS, (data)=>{
      if(data && data.length>0){
        data.map((e, i)=>{
          this.setOnlineUsers(e)
          return('')
        })
      }
    })
    this.socket.on(NEWMESSAGE, (data)=>{
      this.setMessage(data, data.sender_id)
      this.setAllMessage(data, data.sender_id)
      this.setMessageUser(data)
    })

    this.socket.on(TYPING, (data)=>{
      let receiver = this.state.receiver
      receiver.typing = data
      this.setState({
        receiver: receiver
      })
    })
    this.socket.on(NOTTYPING, (data)=>{
      let receiver = this.state.receiver
      receiver.typing = false
      this.setState({
        receiver: receiver
      })
    })
    this.socket.on(RECEIVED_MESSAGE, (data)=>{
      this.updateMessage(data)
    })
  }
  updateMessage = (data)=>{
    let messages = this.state.messages

    if(messages && messages[0]){
      if(messages[0].sender_id === data.receiver_id || messages[0].receiver_id === data.receiver_id){
        console.log("message" , messages);
        const newMessages = messages.map((e, i)=>{
          if(e.sender_id === data.receiver_id){
            return{
              ...e,
              message_status: {
                sent: true,
                received: true
              }
            }
          }else {
            return{
              ...e
            }
          }
        })
        this.setState({
          messages: newMessages,
        })
        console.log(newMessages);
      }
    }
  }
  setOnlineUsers = (e)=>{
    let receiver = e.username
    let receiver_socket_id = e.user_id || ''
    let receiver_id = e._id
    let status = e.status
    let last_seen = e.last_seen
    let imageUrl = e.imageUrl
    let users = this.state.users

    const filtered = users.filter((e, i)=>{
      return e.receiver === receiver
    })
    if(filtered && filtered.length === 0){
      users.push({
        receiver,
        receiver_id,
        receiver_socket_id,
        status,
        last_seen,
        imageUrl,
        messageCount: 0
      })
      this.setState({
        users: users
      })
    }else{
      for(let i=0;i<users.length;i++){
        if(users[i].receiver === receiver){
          users[i].status = status;
          users[i].receiver_socket_id = receiver_socket_id;
          break
        }
      }
      this.setState({
        users: users
      })
    }
  }
  getMessage = (message)=>{
    const msg_id = this.setMessage(message, message.receiver_id)
    const allMsg_id = this.setAllMessage(message, message.receiver_id)
    this.socket.emit(SENDMESSAGE, message, (data)=>{
      if(data.status){
        this.insertMessage(data.message, msg_id)
        this.insertAllMessage(data.message, allMsg_id, message.receiver_id)
      }
    });
  }
  userTyping = (status)=>{
    const data = {receiver_id: this.state.receiver.receiver_socket_id};
    if(status){
      this.socket.emit(USERTYPING, data);
    }else {
      this.socket.emit(USERNOTTYPING, data);
    }
  }
  sendFile = (payload)=>{
    const msg_id = this.setMessage(payload, payload.receiver_id)
    const allMsg_id = this.setAllMessage(payload, payload.receiver_id)

    this.socket.emit(SENDFILE, payload, (data)=>{
      if(data.status){
        this.insertMessage(data.message, msg_id)
        this.insertAllMessage(data.message, allMsg_id, payload.receiver_id)
      }
    })
  }
  setAllMessage = (data, id)=>{
    let allMessages = this.state.allMessages
    if(!allMessages){
      allMessages = []
    }
    if(allMessages[id]){
      allMessages[id].push(data)
      this.setState({
        allMessages: allMessages
      })
      return allMessages[id].indexOf(data)
    }else {
      allMessages[id] = [];
      allMessages[id].push(data)
      this.setState({
        allMessages: allMessages
      })
      return allMessages[id].indexOf(data)
    }
  }
  setMessage = (data, id)=>{
    if(this.state.receiver && this.state.receiver.receiver_id && id){
      let messages = this.state.messages
      if(!messages){
        messages = []
      }
      if(this.state.receiver.receiver_id === id){
        messages.push(data)
        this.setState({
          messages: messages
        })
        return messages.indexOf(data)
      }
    }
  }
  setMessageUser = (data)=>{
    let users = this.state.users
    this.setState({
      users: []
    })
    for(let i=0;i<users.length;i++){
      if(users[i].receiver_id === data.sender_id){
        users[i].messageCount += 1
        break;
      }
    }
    this.setState({
      users: users
    })
  }
  insertMessage = (data, index)=>{
    const messages = this.state.messages
    messages[index] = data;
    this.setState({
      messages: messages
    })
  }
  insertAllMessage = (data, index, id)=>{
    let allMessages = this.state.allMessages
    if(!allMessages){
      allMessages = []
    }
    if(allMessages[id]){
      allMessages[id][index] = data
      this.setState({
        allMessages: allMessages
      })
    }else {
      allMessages[id] = [];
      allMessages[id][index] = data
      this.setState({
        allMessages: allMessages
      })
    }
  }
  receivedMessage = (payload)=>{
    this.socket.emit(RECEIVED_SENDER_MESSAGE, payload)
  }

  render(){
    return(
      <div className="row">
        <OnlineUsers
          user={this.state.user}
          users={this.state.users}
          receiver={this.state.receiver}
          setRecv={(receiver, receiver_id, receiver_socket_id)=>{
            let users = this.state.users
            for(let i=0;i<users.length;i++){
              if(users[i].receiver_socket_id === receiver_socket_id && users[i].receiver_id === receiver_id){
                users[i].messageCount = 0
                this.setState({
                  users: users
                })
                break;
              }
            }

            let allMessages = this.state.allMessages
            if(!allMessages[receiver_socket_id]){
              allMessages[receiver_socket_id] = [];
            }
            this.setState({
              receiver: {
                receiver,
                receiver_id,
                receiver_socket_id,
                typing: false
              },
              messages: allMessages[receiver_socket_id]
            })
          }}
        />
        <div className="col-lg-8">
          {this.state.receiver && this.state.receiver.receiver_socket_id?
            <MessageArea
              receiverDetails={this.state.receiver}
              user={this.state.user}
              messages={this.state.messages}
              getMessage={this.getMessage}
              userTyping={this.userTyping}
              sendFile={this.sendFile}
              receivedMessage={this.receivedMessage}
              updateMessage={this.state.updateMessage}
            />
          :null}
        </div>
      </div>
    )
  }
}
export default ChatContainer;
