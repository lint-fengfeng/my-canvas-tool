import React, { Component, useEffect, useState, useRef } from 'react'

// 引入画笔橡皮
import { Earaser, Pen, Subline, unit } from '../../utils'
// img
import BackImage from '../../image/background.jpg'
import "./index.scss"


console.log(unit, 'aaaaaaaaaaaaaaaa')
class MyDraw extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '已知$R$上奇函数$f(x)$的图象关于直线$x=1$对称，$x∈[0,1]$时，$f\left(x\right)= \dfrac{1}{2}x $．当$x∈[2k-1,2k+1]$时，求$f(x)$的解析式.二次函数$y=ax^{2}+bx+c(a\ne 0)$的图象如图所示，有下列结论：①$abc&gt;0$；②$a+b+c=2$；③$a&gt;\dfrac{1}{2}$；④$b&gt;1$，其中正确的结论个数是$(\qquad)$<br /><img alt="" height="148" src="http://sealdata.youneng.com/img/26985db1bdf6c5545c8f1acdc5176fa1.png" width="157" /><br /><br />'
    }
    this.ctx_up = null
  }

  static propTypes = {};
  static defaultProps = {};

  componentDidMount() {
    this.initCtx()
    this.earaser = new Earaser(this.canvas_up, this.ctx_up)
    this.pen = new Pen(this.canvas_up, this.ctx_up)
    this.subline = new Subline(this.canvas_down, this.ctx_down)
    document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false })
    this.renderMathJax()
  }

  initCtx = () => {
    const { width, height} = this.props
    const _this = this
    this.canvas_up = document.getElementById('canvas_up');
    this.canvas_down = document.getElementById('canvas_down');
    this.canvas_image = document.getElementById("canvas_image")
    // this.canvas_bg = document.getElementById('canvas_bg');
    this.ctx_up = this.canvas_up.getContext('2d');
    this.ctx_down = this.canvas_down.getContext('2d');
    this.ctx_image = this.canvas_image.getContext('2d');
    this.ctx_up.fillStyle = "#ADA6A0"
    // this.ctx_up.fillStyle = "rgba(0,0,0,.5)"
    this.ctx_up.fillRect(0,0, width, height)


    // 图片沉底
    const img = new Image(); img.src = BackImage 
    img.onload = function () {
      _this.ctx_image.drawImage(this, 0, 0, 200, 200)
      // 将图片转换成像素点，把图片上的底色抠成 草稿本颜色
      // const start = new Date().getTime() // 像素点转换之前
      // const pixelList = _this.ctx_image.getImageData(0, 0, width, height)
      // const len = pixelList.data.length
      // for (let i = 0; i < len; i += 4) {
      //   // 凡是白色的像素点  全部转换成草稿本的底色
      //   // if (pixelList.data[i] === 255 && pixelList.data[i + 1] === 255 && pixelList.data[i + 2] === 255) {
      //   //   pixelList.data[i] = 173// r
      //   //   pixelList.data[i + 1] = 166// g
      //   //   pixelList.data[i + 2] = 160// b
      //   // }
      // }
      // _this.ctx_image.putImageData(pixelList, 0, 0)
      // _this.pickImageUp()
      // _this.ctx_image.clearRect(0, 0, width, height)
      // const end = new Date().getTime()
      // console.log("转化消耗", end - start) 
    }
  }

  handleEaraser = () => {
    if (!this.pen.earaser) {
      this.pen.switch(false)
      this.earaser.switch(true)
    }
  }

  handlePen = () => {
    if (!this.pen.open) {
      this.pen.switch(true)
      this.earaser.switch(false)
    }
  } 

  handleSubLine = (x, y) => {
    this.pen.switch(false) // 关闭画笔
    this.earaser.switch(false) // 关闭橡皮
    this.subline.add()
    this.pickUp()
  }

  brushStart = (e) => {
    if (this.pen.open)  {
      console.log(e.touches[0].clientX, e.touches[0].clientY, "手指触摸")
      this.pen.fingerDown(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  brushMove = (e) => {
    console.log(e.touches[0].clientX, e.touches[0].clientY, "手指触摸")
    // e.preventDefault()
    if (this.pen.open) {
      this.pen.fingerMove(e.touches[0].clientX, e.touches[0].clientY)
    } else if (this.earaser.open) {
      this.earaser.earasing(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  // 峰哥起的名字：托起
  pickSublineUp = () => {
    // 将离屏辅助线的canvas画到上层来 
    this.canvas_down.style.display = 'block'
    this.ctx_up.drawImage(this.canvas_down, 0, 0, this.props.width, this.props.height)
    this.canvas_down.style.display = 'none'
  }

  pickImageUp = () => {
    this.canvas_image.style.display = 'block'
    this.ctx_up.drawImage(this.canvas_image, 0, 0, this.props.width, this.props.height)
    this.canvas_image.style.display = 'none'
  }

  renderMathJax = () => {
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub], () => {})
  }
  // rotateSubLine = () => {
  //   this.ctx_up.save();
  //   this.ctx_up.translate(150, 85)
  //   this.ctx_up.rotate(-30 * Math.PI/ 180)

  //   this.ctx_up.beginPath()
  //   this.ctx_up.moveTo(20, 20)
  //   const endX = 200
  //   const endY = 20
  //   this.ctx_up.lineTo(endX, endY)
  //   this.ctx_up.stroke()
  //   this.ctx_up.closePath()
  //   this.ctx_up.restore()
  // }


  render() {
    const { width, height } = this.props
    return (<>
      <button onClick={this.handleEaraser}>橡皮</button>
      <button onClick={this.handlePen}>画笔</button>
      <button onClick={this.addSubLine}>辅助线</button>
      {/* <button onClick={this.rotateSubLine}>旋转</button> */}
      <div>
        <div className="text" dangerouslySetInnerHTML={{__html: this.state.text}}></div>
        <canvas width={width} height={height}  id="canvas_down">你的手机浏览器不支持canvas,请升级浏览器~</canvas>
        <canvas width={width} height={height} onTouchMove={this.brushMove} onTouchStart={this.brushStart} id="canvas_up">你的手机浏览器不支持canvas,请升级浏览器~</canvas>
        <canvas width={width} height={height} id="canvas_image">你的手机浏览器不支持canvas,请升级浏览器~</canvas>
        {/* <canvas width={width} height={height} id="canvas_bg">你的手机浏览器不支持canvas,请升级浏览器~</canvas> */}
      </div>
    </>)
  }
}

const MyDrawContainer = () => {
  const containerRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    setWidth(containerRef.current.clientWidth || 0)
    setHeight(containerRef.current.clientHeight || 0)
  }, [])

  return (
    <div className="mydraw-container" ref={containerRef}>
      { 
        width !== 0 && 
        <MyDraw
          width={width}
          height={height}
        ></MyDraw>
      }
    </div>
    
  )
}

export default MyDrawContainer
