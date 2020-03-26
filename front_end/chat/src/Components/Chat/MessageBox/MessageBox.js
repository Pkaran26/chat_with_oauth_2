import React from 'react'
import MessageForm from './MessageForm'
import { LeftMessage, RightMessage } from './Message'

const MessageBox = ({ currentUser, messages, submitMsg })=>{
  return(
    <div className="card bg-light">
      <div className="card-header">
        <h5></h5>
      </div>
      <div className="card-body messagebox">
        { messages && messages.length>0?
          messages.map((e, i)=>(
            <div key={ i } className="clearfix">
              { currentUser._id === e._id?
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
        />
      </div>
    </div>
  )
}

export default MessageBox