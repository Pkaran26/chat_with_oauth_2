import React, { useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import MessageForm from './MessageForm'
import { LeftMessage, RightMessage } from './Message'
import AttachModel from './AttachModel'

const MessageBox = ({ currentUser: { _id, name, imageUrl, is_online }, messages, typing, userTyping, submitMsg, submitAttach })=>{
  const [attachModel, setAttachModel] = useState(false)
  const [minimize, setMinimize] = useState(false)

  return(
    <div className="card bg-light messagewrap">
      { attachModel?
        <AttachModel
          returnAttach={ (files)=> submitAttach(files) }
          close={ ()=> setAttachModel(false) }
        />
      :null }
      <div className="card-header messageHeader" onClick={ ()=> setMinimize(!minimize) }>
        <h5>
          <img src={ imageUrl } className="pic" alt="userimg2" />
          <i className={`fas fa-circle online2 ${ is_online? 'text-success': 'text-gray' }`}></i>
          { name }</h5>
        <span style={{ position: 'absolute', left: '70px', bottom: '15px' }}>{ typing }</span>
        { minimize?
          <button className="btn btn-secondary btn-sm  attachBtn" onClick={ ()=>setAttachModel(true) }>
            <i className="fas fa-paperclip"></i>
          </button>
        :null }
      </div>
      <div className={`card-body ${ minimize? 'maximizeBody': 'minimizeBody' }`}>
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
      <div className={`card-footer ${ minimize? 'maximizeFooter': 'minimizeFooter' }`} style={{ padding: 0 }}>
        <MessageForm
          submitMsg={ submitMsg }
          userTyping={ userTyping }
        />
      </div>
    </div>
  )
}

export default MessageBox
