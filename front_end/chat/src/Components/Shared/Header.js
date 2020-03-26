import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

const Header = ()=>{
  const [user, setUser] = useState({
    first_name: '',
    last_name: ''
  })
  // useEffect(()=>{
  //   try {
  //     const user = ""
  //     const { first_name, last_name } = user
  //     setUser({
  //       first_name,
  //       last_name
  //     })
  //   } catch (e) {
  //
  //   }
  // }, [])

  return(
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <NavLink className="navbar-brand" to="/dashboard" style={{ fontWeight: '700' }}>
        <i className="fas fa-globe-asia"></i> ASEL Dashboard
      </NavLink>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor03">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <NavLink className="nav-link" to="/dashboard">
              <i className="fas fa-home"></i> Dashboard <span className="sr-only">(current)</span>
            </NavLink>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#a" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="fas fa-door-open"></i> Welcome&nbsp;
              <span className="text-primary">
                { user.first_name ? `${ user.first_name.toUpperCase() } ${ user.last_name.toUpperCase() }`: 'User' }
              </span>
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <NavLink className="nav-item active" style={{ paddingLeft: '15px'}} to="/logout">
                <i className="fas fa-sign-out-alt"></i> logout
              </NavLink>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Header
