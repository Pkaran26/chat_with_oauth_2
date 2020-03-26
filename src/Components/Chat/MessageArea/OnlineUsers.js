import React from 'react'
import online from '../../../images/online.png'
import moment from 'moment'

const OnlineUsers = ({ user, users, setRecv, receiver })=>{
  return(
    <div className="col-lg-4">
      <div className="card bg-light">
        <div className="card-header">Users</div>
        <div className="card-body" style={{height: '400px', overflow: 'auto'}}>
          <ul className="list-group">
            {users.map((e, i)=>{
              if(e.receiver_socket_id !== user.user_id){
                return(
                  <UserLi
                    key={i}
                    e={e}
                    setRecv={setRecv}
                    currentReceiver={receiver}
                  />
                )
              }else {
                return('')
              }
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

const UserLi = ({ e: { receiver, receiver_id, receiver_socket_id, messageCount, status, last_seen, imageUrl }, setRecv, currentReceiver })=>{
  return(
    <li onClick={()=> {
      if(status){
        setRecv(receiver, receiver_id, receiver_socket_id)
      }else {
        alert('you can not send message to offline users')
      }
    }} style={{cursor: 'pointer'}} className="list-group-item d-flex justify-content-between align-items-center">
      <span title={status? "Online": last_seen?  'Last seen '+moment(last_seen).format('DD-MMM-YYYY hh:mm A'): 'Offline'}>
        <img src={ imageUrl } style={{ width: '40px', borderRadius: '20px', marginRight: '15px' }} />
        {status?
          <img alt="online" src={online} style={{width: "11px", marginRight: '5px'}} />
        :<span style={{width: "11px", marginRight: '5px'}}></span>}
        {receiver}
      </span>
      {currentReceiver.receiver_socket_id !== receiver_socket_id?
        messageCount>0?
          <span className="badge badge-primary badge-pill">{ messageCount }</span>
        :null
      :null}
    </li>
  )
}
export default OnlineUsers;
