import React from 'react'
import MessageForm from './MessageForm'
import { LeftMessage, RightMessage } from './Message'

const MessageBox = ({ currentUser, messages, typing, userTyping, submitMsg })=>{
  return(
    <div className="card bg-light">
      <div className="card-header">
        <h5>{ currentUser? currentUser.name : null }</h5>
        <span>{ typing }</span>
      </div>
      <div className="card-body messagebox">
        { messages && messages.length>0?
          messages.map((e, i)=>(
            <div key={ i } className="clearfix">
              { currentUser._id === e.msg_to?
                <RightMessage { ...e } />
              :
                <LeftMessage { ...e }/>
              }
            </div>
          ))
        :
          <div className="text-center" style={{ color: 'lightgray' }}>No conversations</div>
        }
      </div>
      <div className="card-footer">
        <MessageForm
          submitMsg={ submitMsg }
          userTyping={ userTyping }
        />
      </div>
    </div>
  )
}

export default MessageBox
