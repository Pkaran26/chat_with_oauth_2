import React, { useState } from 'react'
import moment from 'moment'



const MessageForm = ({ getMessage, receiver, receiver_id, sender_socket_id, sender_id, receiver_socket_id, userTyping })=>{
  const [message, setMessage] = useState('')
  const submitMessage = (e)=>{
    e.preventDefault()
    if(message && message.length>0){
      getMessage({
        receiver,
        receiver_id,
        receiver_socket_id,
        message,
        sender_socket_id,
        sender_id,
        message_status: {
          sent: false,
          received: false
        },
        datetime: moment()
      })
      setMessage('')
    }
  }
  return(
    <div>
      <form method="post" onSubmit={submitMessage} style={{paddingTop: '15px'}}>
        <div className="form-inline">
          <input type="text" style={{width: '90%'}} placeholder="type something here..." value={message} className="form-control" onChange={(e)=> {
              setMessage(e.target.value)
              if(e.target.value && e.target.value.length>0){
                userTyping(true)
              }else {
                userTyping(false)
              }
            }} />
          <input type="submit" value="Send" className="btn btn-primary" />
        </div>
      </form>
    </div>
  )
}
export default MessageForm
