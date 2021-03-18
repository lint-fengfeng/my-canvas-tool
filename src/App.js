import React from 'react'
import MyDraw from './components/my-draw'
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="canvas">
        <MyDraw />
      </div>
    )
  }
}

export default App;
