import React, { Component, useEffect, useState, useRef } from 'react'
// import ReactDOM from 'react-dom'
// import PropTypes from 'prop-types'
import "./index.scss"

class MyDraw extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.ctx = null
  }

  static propTypes = {};
  static defaultProps = {};

  componentDidMount() {
    this.initCtx()
  }

  initCtx = () => {
    const canvas = document.getElementById('mydraw');
    if (canvas.getContext){
      this.ctx = canvas.getContext('2d');
    } else {
      // canvas-unsupported code here
    }
  }

  

  render() {
    const { width, height } = this.props
    return (<>
      <canvas width={width} height={height} id="mydraw">你的手机浏览器不支持canvas,请升级浏览器~</canvas>
    </>)
  }
}