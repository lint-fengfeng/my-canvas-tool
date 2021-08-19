import React from 'react'
// import MixImg from './components/mix-img'
// import MyDraw from './components/my-draw'
import './App.css';
// import { axios } from './axios'
// import SideBar from './components/SideBar'

class App extends React.Component {
  // componentDidMount() {
  //   function handleVisibilityChange() {
  //     if (document.hidden || document.visibilityState === 'hidden') {
  //        document.write("hello world")

  //     } else  {
  //        document.write("111111111111s")

  //       console.log(window.XdfMoonBridge)
  //     }
  //     // if (document.visibilityState === 'hidden') {
  //     //  } else  {
  //     //   document.write("111111111111s")

  //     //    console.log(window.XdfMoonBridge)
  //     //  }
  //   }
    
  //   window.document.addEventListener("visibilitychange", handleVisibilityChange, false);
  // }

  // clickButton1 = ()  => {
  //   axios.get("/aaa").then(res => {
  //     console.log(res)
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }

  // clickButton2 = ()  => {
  //   axios.get("/bbb").then(res => {
  //     console.log(res)
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }

  componentDidMount() {
    this.updateClock()
  }

  updateClock = () => {
    const now = new Date()
    const sec = now.getSeconds() 
    const min = now.getMinutes() + sec/60
    const hours = now.getHours() % 12 + min/60

    const secAngle = sec * 6
    const minAngle = min * 6
    const hoursAngle = hours * 30
    console.log(hours, min)

    const hourEl = document.querySelector("#clock .hour")
    const minuteEl = document.querySelector("#clock .minute")
    const secondEl = document.querySelector("#clock .second")

    hourEl.setAttribute("transform", `rotate(${hoursAngle}, 50, 50)`)
    minuteEl.setAttribute("transform", `rotate(${minAngle}, 50, 50)`)
    secondEl.setAttribute("transform", `rotate(${secAngle}, 50, 50)`)
    setTimeout(this.updateClock, 1000)
  }

  render() {
    return (
      <div className="app">
        <p class="title">下班倒计时:</p>
        <svg
          id='clock'
          width='500'
          height='500'
          viewBox='0 0 100 100'
        >
          <circle class='face' cx='50' cy='50' r='45'/>
          <g class="ticks">
            <line x1='50' y1='5' x2='50' y2='10' />
            <line x1='95' y1='50' x2='90' y2='50' />
            <line x1='50' y1='95' x2='50' y2='90' />
            <line x1='5' y1='50' x2='10' y2='50' />
          </g>
          <g class="number">
            <text x="50" y="18">12</text>
            <text x="15" y="53">3</text>
            <text x="85" y="53">9</text>
            <text x="50" y="88">6</text>
          </g>
          <g class="hands">
            <line class="hour" x1='50' y1='50' x2='50' y2='30' />
            <line class='minute' x1='50' y1='50' x2='50' y2='25' />
            <line class="second" x1='50' y1='50' x2='50' y2='22' />
          </g>
        </svg>
        {/* 前端环形进度条 */}
        {/* <div className="box">
          <div className="inner1"></div>
          <div className="inner2"></div>
        </div> */}
        {/* svg实现环形进度条 */}
        {/* <SideBar /> */}
        {/* <button onClick={this.clickButton1}>发送请求aaa</button>
        <button onClick={this.clickButton2}>发送请求bbb</button> */}
      </div>
    )
  }
}

export default App;
