import React, { Component, useEffect, useState, useRef } from 'react'
// 引入画笔橡皮
import { Earaser, Pen, Subline, unit } from '../../utils'
// img
import BackImage from '../../image/background.jpg'
import { Toast } from 'xdf-mini-lib-test'
import "./index.scss"


console.log(unit, 'aaaaaaaaaaaaaaaa')
class MyDraw extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '已知$R$上奇函数$f(x)$的图象关于直线$x=1$对称，$x∈[0,1]$时，$f\left(x\right)= \dfrac{1}{2}x $．当$x∈[2k-1,2k+1]$时，求$f(x)$的解析式.二次函数$y=ax^{2}+bx+c(a\ne 0)$的图象如图所示，有下列结论：①$abc&gt;0$；②$a+b+c=2$；③$a&gt;\dfrac{1}{2}$；④$b&gt;1$，其中正确的结论个数是$(\qquad)$<br /><img alt="" height="148" src="http://sealdata.youneng.com/img/26985db1bdf6c5545c8f1acdc5176fa1.png" width="157" /><br /><br />'
    }
    this.canvas_up = null
    this.canvas_down = null 
    this.canvas_image = null

    this.ctx_up = null
    this.ctx_down = null
    this.ctx_image = null
    
    // 没有辅助线的草稿本的点阵
    this.saveCanvasWithoutSubline = null
  }

  static propTypes = {};
  static defaultProps = {};

  componentDidMount() {
    Toast.info({text: '哈哈哈'})
    this.initCtx()
    this.earaser = new Earaser(this.canvas_up, this.ctx_up)
    this.pen = new Pen(this.canvas_up, this.ctx_up)
    // 此处非常注意 辅助线在单独一层canvas
    this.subline = new Subline(this.canvas_down, this.ctx_down)
    document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false })
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
      // _this.pickUp(this.canvas_image)
      // _this.ctx_image.clearRect(0, 0, width, height)
      // const end = new Date().getTime()
      // console.log("转化消耗", end - start) 
    }
  }

  handleEaraser = () => {
    if (!this.pen.earaser) {
      this.pen.switch(false)
      this.subline.switch(false)
      this.earaser.switch(true)
    }
  }

  handlePen = () => {
    if (!this.pen.isOpen) {
      this.earaser.switch(false)
      this.subline.switch(false)
      this.pen.switch(true)
    }
  } 

  handleSubLine = (x, y) => {
    this.pen.switch(false) // 关闭画笔
    this.earaser.switch(false) // 关闭橡皮
    // 如果已经有辅助线了  需要先回退  在初次添加辅助线前 也要存上层canvas
    if (this.subline.count > 0) {
      this.rollbackUp()
    }
    // 添加辅助线之前 存没有辅助线的样子
    this.saveUp()
    // 打开辅助线开关  并添加
    this.subline.switch(true).add()
    // 托起
    this.pickUp(this.canvas_down)
  }

  //辅助线的status 0-未选中 1-选中 2-延长 3-拖拽 4-删除 
  brushStart = (e) => {
    if (this.pen.isOpen)  { // 当前使用画笔
      console.log(e.touches[0].clientX, e.touches[0].clientY, "手指触摸")
      this.pen.fingerDown(e.touches[0].clientX, e.touches[0].clientY)
    }

    const { status, isOpen } = this.subline
    if (isOpen) {
      // 返回延长的点的key 如果没有延长返回null
      this.isExtend = this.subline.isExtend(e.touches[0].clientX, e.touches[0].clientY)
      this.isDrag = this.subline.isDrag(e.touches[0].clientX, e.touches[0].clientY)
      if (this.isExtend && status === 1) { // 延伸
        // 存储拖拽的是p1 还是p2
        this.extendKey = this.isExtend
        this.subline.switchStatus('status', 2)
      } else if (this.isDrag && status === 1) { // 拖拽
        this.subline.switchStatus('status', 3)
        // 记录拖拽 其实落点
        this.startDragPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      } else if (status <= 1) { // 选中
        // 如果没有被选中 走判断选中逻辑
        this.subline.choose(e.touches[0].clientX, e.touches[0].clientY).then(() => {
          this.rollbackUp()
          // 选中完了 托起
          this.pickUp(this.canvas_down)
        })
      }
    }
    // 用橡皮、笔的时候; 辅助线下移, 回退到没有辅助线的样子 
    // 再走后续的move 去画
    if (this.pen.isOpen || this.earaser.isOpen) {
      this.rollbackUp()
    }
  }

  brushMove = (e) => {
    const { clientX, clientY } = e.touches[0]
    // console.log(clientX, clientY, "手指触摸")
    // e.preventDefault()
    if (this.pen.isOpen) { // 画笔
      this.pen.fingerMove(clientX, clientY)
    } else if (this.earaser.isOpen) { // 橡皮
      this.earaser.earasing(clientX, clientY)
    }

    const { status, isOpen } = this.subline
    if (isOpen) {
      switch(status) {
        case 2: { // 辅助线 延长两侧
          // 每一次延长挪动  都要重新回退到画布什么都没有的样子
          this.rollbackUp()
          this.subline.extendTo(this.extendKey, clientX, clientY)
          this.pickUp(this.canvas_down)
          break
        }
        case 3: { // 辅助线 拖拽
          const obj = {
            x: clientX - this.startDragPosition.x,
            y: clientY - this.startDragPosition.y
          }
          this.rollbackUp()
          this.subline.drag(obj.x, obj.y)
          this.pickUp(this.canvas_down)
          this.startDragPosition = { x: clientX, y: clientY }
          break
        } 
        case 4: { // 辅助线 删除
          break
        }
      }
    }
  }

  brushEnd = (e) => {
    // 画笔、橡皮的时候 画完先存好 
    if (this.pen.isOpen || this.earaser.isOpen) {
      this.saveUp()
    }

    if (this.subline.isOpen && this.subline.status === 2) {
      this.subline.switchStatus('status', 1)
    }

    if (this.subline.isOpen && this.subline.status === 3) {
      this.subline.switchStatus('status', 1)
    }

    // 再 托起
    this.pickUp(this.canvas_down)
  }

  // 只要上层canvas发生了变化
  // 都要进行存储，不存辅助线
  // 因此变化前都要线回退
  // 存完的值便于 下一次变化的时候回退
  saveUp = () => {
    const { width, height } = this.props
    this.saveCanvasWithoutSubline = this.ctx_up.getImageData(0, 0, width, height )
    // }
  }

  // 只要辅助线有样式上的变化 
  // 包括取消选中
  // 新增的辅助线是选中的
  // 都要对上层canvas进行回退
  rollbackUp = () => {
    if (this.saveCanvasWithoutSubline) {
      this.ctx_up.putImageData(this.saveCanvasWithoutSubline, 0, 0)
    }
  }

  // 雪峰起的名字：托起 (不知道好不好，暂时先这么叫)
  pickUp = (canvas) => {
    // 将离屏辅助线的canvas画到上层来 
    canvas.style.display = 'block'
    this.ctx_up.drawImage(canvas, 0, 0, this.props.width, this.props.height)
    // canvas.style.display = 'none'
  }

  // 有些场景为了 上层回退回没有选中样式的时候， 下层还在选中状态
  // 所以需要隐藏下层的canvas
  hideDown() {
    this.canvas_down.style.display = "none"
  }

  render() {
    const { width, height } = this.props
    return (<>
      <button onClick={this.handleEaraser}>橡皮</button>
      <button onClick={this.handlePen}>画笔</button>
      <button onClick={this.handleSubLine}>辅助线</button>
      {/* <button onClick={this.rotateSubLine}>旋转</button> */}
      <div>
        <canvas width={width} height={height}
          onTouchStart={this.brushStart}
          onTouchMove={this.brushMove}
          onTouchEnd={this.brushEnd} id="canvas_up"
        >你的手机浏览器不支持canvas,请升级浏览器~</canvas>

        <canvas width={width} height={height}
          // onTouchStart={this.brushStartDown}
          // onTouchMove={this.brushMoveDown}
          // onTouchEnd={this.brushEndDown}
          id="canvas_down"
        >你的手机浏览器不支持canvas,请升级浏览器~</canvas>

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
