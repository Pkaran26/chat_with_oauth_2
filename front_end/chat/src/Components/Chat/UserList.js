import React from 'react'

const UserList = ({ users, returnUser })=>{
  return(
    <div className="card bg-light">
      <div className="card-header">
        <h5>Users List</h5>
      </div>
      <div className="card-body">
      <div class="list-group">
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
  <span class="list-group-item list-group-item-action cursor" onClick={ ()=> returnUser(e) }>
    { e.name }
  </span>
)

export default UserList
