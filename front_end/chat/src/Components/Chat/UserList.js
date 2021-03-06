import React from 'react'

const UserList = ({ users, returnUser })=>{
  return(
    <div className="card bg-light userlist">
      <div className="card-header">
        <h5>Users List</h5>
      </div>
      <div className="card-body" style={{ overFlow: 'auto', height: '437px'}}>
      <div className="list-group">
        { users && users.length>0?
          users.map((e, i)=>(
            <User
              key={ i }
              e={ e }
              returnUser={ returnUser }
            />
          ))
        :null }
        </div>
      </div>
    </div>
  )
}

const User = ({ e, returnUser })=>(
  <span className="list-group-item list-group-item-action cursor" style={{ position: 'relative' }} onClick={ ()=> returnUser(e) }>
    <img src={ e.imageUrl } className="pic" alt="userimg1" />
    <i className={`fas fa-circle online ${ e.is_online? 'text-success': 'text-gray' }`}></i>
    { e.name }
    { e.message_count?
      <span className="badge badge-danger message_count">{ e.message_count }</span>
    :null }
  </span>
)

export default UserList
