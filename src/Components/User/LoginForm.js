import React, { useState } from 'react'
import GoogleLogin from 'react-google-login';

const LoginForm = ({ userLogin })=>{

  const responseGoogle = (response) => {
    console.log(response);

    const { profileObj: { imageUrl, name, email }} = response

    userLogin({
      imageUrl,
      username: name,
      email: email,
    })
  }

  return(
    <div className="row">
      <div className="col-lg-4"></div>
      <div className="col-lg-4">
        <div className="card bg-light" style={{ marginTop: '50px' }}>
          <div className="card-heading"></div>
          <div className="card-body">
            <GoogleLogin
              clientId="389277750854-6br6j6hi7pca3p07k5m1shgluf9nsssm.apps.googleusercontent.com"
              render={renderProps => (
                <button
                  style={{ width: '100%' }}
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="btn btn-info btn-lg"
                >
                  Login Using Google
                </button>
              )}
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginForm
