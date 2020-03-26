import React, { Component } from 'react'
import UserList from './UserList'
import MessageBox from './MessageBox/MessageBox'

class Chat extends Component{
  constructor(props){
    super(props)
    this.state = {
      users: [],
      currentUser: '',
      messages: [],
    }
  }

  setCurrentUser = (user)=>{
    this.setState({
      currentUser: user
    })
  }

  submitMsg = (msg)=>{

  }

  render(){
    const { users, currentUser, messages } = this.state
    return(
      <div className="container-fluid" style={{ marginTop: '50px' }}>
        <div className="row">
          <div className="col-lg-4 col-md-4">
            <UserList
              users={ users }
              returnUser={ this.setCurrentUser }
            />
          </div>
          <div className="col-lg-8 col-md-8">
            <MessageBox
              currentUser={ currentUser }
              messages={ messages }
              submitMsg={ this.submitMsg }
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Chat
