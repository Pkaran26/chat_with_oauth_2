import React from 'react';
import './App.css';
import Chat from './Components/Chat/Chat'

class App extends React.Component {
  render(){
    return (
      <div className="App container-fluid">
        <Chat/>
      </div>
    )
  }
}

export default App;
