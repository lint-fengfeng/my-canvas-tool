// function saveImage() { // 存储初始样式
//   savedImage = context.getImageData(0, 0, canvas.width, canvas.height);
// }

// function restoreImage() { // 重新绘画存储的图片
//   context.putImageData(savedImage, 0, 0);
// }

// save = () => {
//   this.ctx_up.save()
// }

// restore = () => {
//   this.ctx_up.restore()
// }

// 1.异次元空间
// canvas.save() canvas.restore() 结合使用，
// .save()函数在前，.restore()函数在后
// 保证在函数所做的操作, 不会对原来在canvas上所画图形产生影响

// 2.离屏canvas
// 两张canvas重叠落在一起
// 3.回退canvas
const creenWidth = document.body.clientWidth
const isPad = document.body.clientWidth >= 600

/**
 * pad屏幕分成 1200份 设计稿是600
 * 手机分成750份  设计稿是375
 * 由于canvas上一个像素用number标识，没有px像素单位，
 * 考虑到屏幕适配  才定义基值
 */
export const unit = (() => {
  let temp
  if (isPad) {
    temp = Number((creenWidth / 1200).toFixed(1))
  } else {
    temp = Number((creenWidth / 750).toFixed(1))
  }
  return temp
})()

/**
 * 基类
 * 公共属性方法
 */
class BaseTool {
  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
  }

  position = (x, y) => {
    var aroundStyle = this.canvas.getBoundingClientRect();
    var elStyle = window.getComputedStyle(this.canvas);
    return {
        x: (x - aroundStyle.left - parseInt(elStyle.paddingLeft) - parseInt(elStyle.borderLeft))
            * (this.canvas.width / parseInt(elStyle.width)),
        y: (y - aroundStyle.top - parseInt(elStyle.paddingTop) - parseInt(elStyle.borderTop))
            * (this.canvas.height / parseInt(elStyle.height))
    };
  }
}

export class Pen extends BaseTool {
  constructor(canvas, ctx, isOpen, size, color, shape) {
    super(canvas, ctx)
    console.log(canvas, ctx, this)
    this.open = isOpen || true
    this.size = size || 3 * unit
    this.color = color || "#000000"
    this.shape = shape || 'round'
  }

  changeSize(size) {
    this.size = size 
    return this
  }

  switch(isOpen) {
    this.open = isOpen
    return this
  }

  fingerDown = (startX, startY) => {
    if (!this.open) return
    const { x, y } = this.position(startX, startY)
    this.startX = x
    this.startY = y
  }

  fingerMove = (toX, toY) => {
    if (!this.open) return
    const { x, y } = this.position(toX, toY)
    this.ctx.save();
    this.ctx.beginPath()
    this.ctx.lineWidth = this.size
    this.ctx.strokeStyle = this.color
    this.ctx.lineCap = this.shape
    this.ctx.moveTo(this.startX, this.startY)
    this.ctx.lineTo(x, y)
    this.ctx.stroke()
    this.ctx.restore()
    this.startX = x
    this.startY = y
  }

 
} 

export class Earaser extends BaseTool {
  constructor(canvas, ctx, isOpen, size, color, shape) {
    super(canvas, ctx)
    this.open = isOpen || false
    this.shape = shape || 'circles' // 还可以传入rect
    this.size = size || 16 * unit
    
    this.color = color || '#ADA6A0'
    // this.color = color || 'rgba(0,0,0,.5)'
  }

  changeColor(color) {
    this.color = color 
    return this
  }
  
  changeShape(shape) {
    this.shape = shape 
    return this
  }

  changeSize(size) {
    this.size = size 
    return this
  }

  switch(isOpen) {
    this.open = isOpen
    return this
  }

  earasing(touchX, touchY) {
    if (!this.open) return
    const { x, y } = this.position(touchX, touchY)
    this.ctx.beginPath()
    this.ctx.fillStyle = this.color
    if (this.shape === 'circles') {
      this.ctx.arc(x, y, this.size, 0, Math.PI * 2, true)
    } else {
      this.ctx.rect(x, y, parseInt(this.size * 2), parseInt(this.size * 2))
    }
    this.ctx.fill()
    return this
  }
} 

export class Subline extends BaseTool {
  constructor(canvas, ctx, size, color, shape) {
    super(canvas, ctx)
    this.size = size || 6 * unit
    this.color = color || "#FC632C"
    this.shape = shape || 'round'
    
    this.spacing = 2 * unit
    this.dashLength = 6 * unit
    this.startPoint = {
      x: isPad ? (200 * unit) : (150 * unit),
      y: 100 * unit
    }
    this.endPoint = {
      x: isPad ? (950 * unit) : (580 * unit),
      y: 100 * unit  
    }
    this.sublineGroup = []
  }


  add() {
    this.ctx.beginPath()
    this.ctx.setLineDash([6, 2])
    this.ctx.lineWidth = this.size
    this.ctx.strokeStyle = this.color
    this.ctx.lineCap = 'rect'
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y)
    this.ctx.lineTo(this.endPoint.x, this.endPoint.y)
    this.ctx.stroke()
    return this
    // return { endX, endY }
  }

  choose() {

  }

}
