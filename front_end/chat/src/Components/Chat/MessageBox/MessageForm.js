import React, { useState } from 'react'

const MessageForm = ({ submitMsg, userTyping })=>{
  const [msg, setMsg] = useState('')

  const onSubmit = (e)=>{
    e.preventDefault()
    submitMsg(msg)
    userTyping('')
    setMsg('')
  }
  return(
    <form method="post" onSubmit={ onSubmit }>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter something..."
          className="form-control"
          onChange={ (e)=>{
            if(e.target.value){
              userTyping("typing...")
            }else {
              userTyping("")
            }
            setMsg(e.target.value)
          } }
          value={ msg }
          required={ true }
        />
        <div className="input-group-append">
          <input
            type="submit"
            className="btn btn-primary"
            value="Send"
          />
        </div>
      </div>
    </form>
  )
}

export default MessageForm
