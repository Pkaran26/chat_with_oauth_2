import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import UserList from './UserList'
import MessageBox from './MessageBox/MessageBox'
import moment from 'moment'
import UserLogin from '../User/UserLogin'
import Header from '../Shared/Header'
import { SERVER_URL } from '../Shared/Urls'
import {
  CONNECTION, DISCONNECT, LOGIN,
  USER_LIST, SUBMIT_MESSAGE, ATTACH_FILE,
  NEW_MESSAGE, SINGLE_CONVERSIONS,
  TYPING, USER_TYPING
} from "./SocketEvents";

class Chat extends Component{
  constructor(props){
    super(props)
    this.state = {
      socket_id: '',
      users: [],
      loggedUser: '',
      currentUser: '',
      messages: [],
      typing: ''
    }
    this.socket = null
  }

  componentDidMount(){
    this.socket = socketIOClient(`${ SERVER_URL }`);
    this.socket.on(CONNECTION, ()=>{
      this.setState({
        socket_id: this.socket.id
      })
    })

    this.socket.on(DISCONNECT, ()=>{
      this.setState({
        socket_id: ''
      })
    })

    this.socket.on(USER_LIST, (data)=>{
      const users = data.filter(e =>{
        return e._id !== this.state.loggedUser._id
      })
      this.setState({
        users: users
      })
      const { currentUser } = this.state
      if(currentUser && currentUser._id){
        const temp = users.filter((e)=>{
          return e._id === currentUser._id
        })
        if(temp && temp.length>0){
          this.setState({
            currentUser: temp[0]
          })
        }
      }
    })

    this.socket.on(NEW_MESSAGE, (data)=>{
      const { messages }= this.state
      this.setState({
        messages: [...messages, data]
      })
      this.setMesssageCount(data)
    })

    this.socket.on(USER_TYPING, (data)=>{
      this.setState({
        typing: data
      })
    })
  }

  setMesssageCount = (data)=>{
    const { users, currentUser }= this.state
    let temp = [...users]
    if((currentUser && data.msg_from !== currentUser._id) || (!currentUser)){
      if(users.length>0){
        for (let i = 0; i < users.length; i++) {
          if(users[i]._id === data.msg_from){
            temp[i].message_count += 1
            this.setState({
              users: temp
            })
            break
          }
        }
      }
    }
  }

  resetMessgaeCount = (selectedUser)=>{
    const { users }= this.state
    let temp = [...users]
    for (let i = 0; i < users.length; i++) {
      if(users[i]._id === selectedUser._id){
        temp[i].message_count = 0
        this.setState({
          users: temp
        })
        break
      }
    }
  }

  userLogin = (payload)=>{
    this.socket.emit(LOGIN, { payload, socket_id: this.state.socket_id }, (data)=>{
      this.setState({
        loggedUser: data
      })
    })
  }

  setCurrentUser = (user)=>{
    this.setState({
      currentUser: user
    })
    this.resetMessgaeCount(user)
    const { loggedUser } = this.state
    const payload = {
      msg_from: user._id,
      msg_to: loggedUser._id
    }
    this.socket.emit(SINGLE_CONVERSIONS, payload, (data)=>{
      this.setState({
        messages: data
      })
    })
  }

  submitMsg = (msg)=>{
    const { loggedUser, currentUser, messages } = this.state
    const message = {
      msg_from: loggedUser._id,
      msg_to: currentUser._id,
      msg: msg,
      created_at: moment().format('YYYY-MM-DD')
    }
    const payload = {
      message,
      receiver_socket_id: currentUser.socket_id
    }
    this.socket.emit(SUBMIT_MESSAGE, payload, (data)=>{
      this.setState({
        messages: [...messages, data]
      })
    })
  }

  submitAttach = (files)=>{
    const { loggedUser, currentUser, messages, socket_id } = this.state
    const message = {
      msg_from: loggedUser._id,
      msg_to: currentUser._id,
      files,
      created_at: moment().format('YYYY-MM-DD')
    }
    const payload = {
      message,
      receiver_socket_id: currentUser.socket_id,
      sender_socket_id: socket_id
    }
    this.socket.emit(ATTACH_FILE, payload, (data)=>{
      this.setState({
        messages: [...messages, data]
      })
    })
  }

  userTyping = (value)=>{
    const { currentUser } = this.state
    this.socket.emit(TYPING, {
      receiver_socket_id: currentUser.socket_id,
      typing: value
    })
  }

  render(){
    const { users, currentUser, loggedUser, messages, typing } = this.state
    return(
      <React.Fragment>
        { loggedUser?
          <div style={{ marginTop: '100px' }}>
            <Header
              name={ loggedUser.name }
              imageUrl={ loggedUser.imageUrl }
            />
            <div className="row">
            <div className="col-lg-4 col-md-4">
              <UserList
                users={ users }
                returnUser={ this.setCurrentUser }
              />
            </div>
            <div className="col-lg-8 col-md-8">
              { currentUser?
                <MessageBox
                  currentUser={ currentUser }
                  messages={ messages }
                  typing={ typing }
                  userTyping={ this.userTyping }
                  submitMsg={ this.submitMsg }
                  submitAttach={ this.submitAttach }
                />
            :null }
            </div>
          </div>
          </div>
        :
          <UserLogin
            userLogin={ this.userLogin }
          />
        }
      </React.Fragment>
    )
  }
}

export default Chat
