import React from 'react'
import moment from 'moment'

export const LeftMessage = ({ msg_from: { name }, msg, created_at })=>{
  return(
    <div className="message messageLeft bg-primary">
      <Message
        name={ name }
        msg={ msg }
        created_at={ created_at }
      />
    </div>
  )
}

export const RightMessage = ({ msg_to: { name }, msg, created_at })=>{
  return(
    <div className="message messageRight bg-success">
      <Message
        name={ name }
        msg={ msg }
        created_at={ created_at }
      />
    </div>
  )
}

const Message = ({ name, msg, created_at })=>(
  <React.Fragment>
    <strong>{ name }</strong>
    <div>{ msg }</div>
    <div>
      <small>{ moment(created_at).format('DD-MMM-YY hh:mm A') }</small>
    </div>
  </React.Fragment>
)
