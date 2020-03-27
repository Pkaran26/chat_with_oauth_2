import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import UserList from './UserList'
import MessageBox from './MessageBox/MessageBox'
import moment from 'moment'
import UserLogin from '../User/UserLogin'

import {
  CONNECTION, DISCONNECT, LOGIN, USER_DETAILS,
  GET_USER_LIST, USER_LIST, SUBMIT_MESSAGE, NEW_MESSAGE,
  USER_CONVERSATIONS, SINGLE_CONVERSIONS,
  TYPING, USER_TYPING, NOT_TYPING, USER_NOT_TYPING
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
    }
    this.socket = null
  }

  setCurrentUser = (user)=>{
    this.setState({
      currentUser: user,
      messages: []
    })
  }

  componentDidMount(){
    this.socket = socketIOClient('http://localhost:3005');
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
    })

    this.socket.on(NEW_MESSAGE, (data)=>{
      const { messages }= this.state
      this.setState({
        messages: [...messages, data]
      })
      console.log(data);
    })
  }

  userLogin = (payload)=>{
    this.socket.emit(LOGIN, { payload, socket_id: this.state.socket_id }, (data)=>{
      this.setState({
        loggedUser: data
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
      console.log(data);
    })
  }

  render(){
    const { users, currentUser, loggedUser, messages } = this.state
    return(
      <React.Fragment>
        { loggedUser?
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
                  submitMsg={ this.submitMsg }
                />
            :null }
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
