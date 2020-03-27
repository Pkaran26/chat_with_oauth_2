import React, { useState, useEffect } from 'react'

const Header = ({ name, imageUrl })=>{

  return(
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <a href="#a" className="navbar-brand" style={{ fontWeight: '700' }}>
        <i className="fas fa-globe-asia"></i> ChatApp using OAuth 2.0
      </a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor03">
        <ul className="navbar-nav mr-auto">

        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown" style={{ position: 'relative' }}>
            <strong>
              <i className="fas fa-door-open"></i> Welcome&nbsp;{ name }&nbsp;&nbsp;
                <img src={ imageUrl } className="pic" />
            </strong>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Header
