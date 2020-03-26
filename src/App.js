import React, { Component } from 'react';
import socketIOClient from 'socket.io-client'
import { NEWUSER, CONNECTION, DISCONNECT} from './SocketEvents'
import './App.css';
import Header from './Components/Chat/Header'
import ChatContainer from './Components/Chat/ChatContainer'
import LoginForm from './Components/User/LoginForm'

class App extends Component {
  constructor(){
    super()
    this.state = {
      user_id: '',
      user: '',
      loggedIn: false,
    }
    this.socket = null
  }

  componentDidMount(){
    this.socket = socketIOClient('http://localhost:3005');
    this.socket.on(CONNECTION, ()=>{
      this.setState({
        user_id: this.socket.id
      })
    })

    this.socket.on(DISCONNECT, ()=>{
      this.setState({
        user: '',
        user_id: '',
        loggedIn: false
      })
    })
  }

  userLogin = (payload)=>{
    payload.user_id = this.state.user_id
    this.socket.emit(NEWUSER, payload, (data)=>{
      console.log(data);
      if(data && data.status){
        let updatedPayload = data.user
        updatedPayload.user_id = this.state.user_id
        this.setState({
          user: updatedPayload,
          loggedIn: data.status
        })
      }else {
        alert(data.err)
      }
    })
  }

  render(){
    return (
      <div>
        <Header user={this.state.user && this.state.user.username? this.state.user : ''} />
        <div className="container" style={{marginTop: '30px'}}>
          {this.state.loggedIn?
            <ChatContainer
              socket={this.socket}
              loggedUser={this.state.user}
            />
          :
            <LoginForm
              userLogin={this.userLogin}
            />
          }
        </div>
      </div>
    );
  }
}

export default App;
