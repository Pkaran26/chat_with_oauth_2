import React, { useState } from 'react'

const MessageForm = ({ submitMsg })=>{
  const [msg, setMsg] = useState('')

  const onSubmit = (e)=>{
    e.preventDefault()
    submitMsg(msg)
  }
  return(
    <form method="post" onSubmit={ onSubmit }>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter something..."
          className="form-control"
          onChange={ (e)=> setMsg(e.target.value) }
          value={ msg }
          required="true"
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
