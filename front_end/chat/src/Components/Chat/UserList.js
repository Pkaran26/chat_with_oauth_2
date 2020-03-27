import React from 'react'

const UserList = ({ users, returnUser })=>{
  return(
    <div className="card bg-light">
      <div className="card-header">
        <h5>Users List</h5>
      </div>
      <div className="card-body">
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
    <img src={ e.imageUrl } className="pic" />
    <i class="fas fa-circle text-success online"></i>
    { e.name }
  </span>
)

export default UserList
