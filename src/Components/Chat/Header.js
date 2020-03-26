import React from 'react'

const Header = ({ user })=>{
  return(
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href="#a">ChatApp</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor01">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <a className="nav-link" href="#a">
              { user && user.imageUrl?
                <React.Fragment>
                  <img src={ user.imageUrl } style={{ width: '40px', borderRadius: '20px', marginRight: '15px' }} />
                  Welcome { user.username }
                </React.Fragment>
              : 'Welcome Guest' }
            <span className="sr-only">(current)</span></a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default Header;
