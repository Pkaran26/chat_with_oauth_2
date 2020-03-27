import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import MessageForm from './MessageForm'
import { LeftMessage, RightMessage } from './Message'

const MessageBox = ({ currentUser: { _id, name, imageUrl, is_online }, messages, typing, userTyping, submitMsg })=>{
  return(
    <div className="card bg-light">
      <div className="card-header" style={{ position: 'relative' }}>
        <h5>
          <img src={ imageUrl } className="pic" alt="userimg2" />
          <i class={`fas fa-circle online2 ${ is_online? 'text-success': 'text-gray' }`}></i>
          { name }</h5>
        <span style={{ position: 'absolute', left: '70px', bottom: '15px' }}>{ typing }</span>
      </div>
      <div className="card-body">
        <ScrollToBottom className="messagebox">
          { messages && messages.length>0?
            messages.map((e, i)=>(
              <div key={ i } className="clearfix">
                { _id === e.msg_to?
                  <RightMessage { ...e } />
                :
                  <LeftMessage { ...e }/>
                }
              </div>
            ))
          :
            <div className="text-center" style={{ color: 'lightgray' }}>No conversations</div>
          }
        </ScrollToBottom>
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
