import closeImage from './image/close.png'

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

const icon = new Image()
icon.src = closeImage
/**
 * 基类
 * 公共属性方法
 */
class BaseTool {
  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
    this.aroundStyle = this.canvas.getBoundingClientRect()
    this.elStyle = window.getComputedStyle(this.canvas)
  }

  position(x, y)  {
    return {
        x: (x - this.aroundStyle.left - parseInt(this.elStyle.paddingLeft) - parseInt(this.elStyle.borderLeft))
            * (this.canvas.width / parseInt(this.elStyle.width)),
        y: (y - this.aroundStyle.top - parseInt(this.elStyle.paddingTop) - parseInt(this.elStyle.borderTop))
            * (this.canvas.height / parseInt(this.elStyle.height))
    };
  }
}

export class Pen extends BaseTool {
  constructor(canvas, ctx, isOpen, size, color, shape) {
    super(canvas, ctx)
    console.log(canvas, ctx, this)
    this.isOpen = isOpen || true
    this.size = size || 2 * unit
    this.color = color || "#000000"
    this.shape = shape || 'round'
  }

  changeSize(size) {
    this.size = size 
    return this
  }

  switch(isOpen) {
    this.isOpen = isOpen
    return this
  }

  fingerDown = (toX, toY) => {
    if (!this.isOpen) return
    const { x, y } = this.position(toX, toY)
    this.startX = x
    this.startY = y
  }

  fingerMove = (toX, toY) => {
    if (!this.isOpen) return
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
    this.isOpen = isOpen || false
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
    this.isOpen = isOpen
    return this
  }

  earasing(touchX, touchY) {
    if (!this.isOpen) return
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
  constructor(canvas, ctx, isOpen, size, color, shape) {
    super(canvas, ctx)
    this.isOpen = isOpen || false
    this.size = size || 4 * unit
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
    // 后续可限制最多多少条辅助线
    this.sublineGroup = []
    this.count = 0 // 当前辅助线条数
    this.maxCount = 15 // 最大条数

    // 触摸最大误差
    this.offset = 6

    // status 0-未选中 1-选中 2-延长中 3-拖拽中 4-删除中
    this.status = 0
    // 初始化 画笔样式 暂时没有提供 修改样式的方法
    // 后续再加 参照pen 和 earaser
    this.ctx.lineWidth = this.size
    this.ctx.strokeStyle = this.color
    this.ctx.lineCap = 'rect'
  }
  
  // 开关
  switch(isOpen) {
    // 暂时写在这
    this.isOpen = isOpen
    return this
  }

  // 操作状态
  switchStatus(type, value) {
    this[type] = value
    return this
  }

  // 缓存一条辅助线
  cache(p1, p2) {
    // TODO: Toast.info({text: `最多只能添加${this.maxCount}条辅助线`})
    if (this.count === this.maxCount) return alert(`最多只能添加${this.maxCount}条辅助线`)
    this.count ++ 
    this.sublineGroup.push({ p1, p2, isChoose: true })
    return this
  }

  // 画普通的辅助线
  drawCommonLine(p1, p2) {
    this.ctx.beginPath()
    this.ctx.setLineDash([6, 2])
    this.ctx.moveTo(p1.x, p1.y)
    this.ctx.lineTo(p2.x, p2.y)
    this.ctx.stroke()
  }

  // 画被选中的辅助线
  drawChooseLine(p1, p2) {
    // this.ctx.save() // 只有这条线需要选中 ， 所以存一下
    this.drawCommonLine(p1, p2)
    // 画两个边的选中状态
    this.drawHandleBtn(p1, 'rect')
    this.drawHandleBtn(p2, 'rect')
    // 画删除按钮
    this.drawDelete(p1, p2)
    // this.ctx.restore()
  }

  // 换选中后两边的圆
  drawHandleBtn(p, shape = 'arc') {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = this.color
    this.ctx.fillStyle = "#fff";
    if (shape === 'arc') {
      this.ctx[shape](p.x, p.y, parseInt(15 * unit), 0, Math.PI * 2, true);
    } else {
      this.ctx[shape](parseInt(p.x - 8 * unit), parseInt(p.y - 8 * unit), parseInt(17 * unit), parseInt(17 * unit));
    }
    this.ctx.fill()
    this.ctx.restore()
  }

  drawImage(p) {
    const iconSize = parseInt(16 * unit)
    this.ctx.drawImage(icon, parseInt(p.x - iconSize / 2), parseInt(p.y - iconSize / 2), iconSize + 1, iconSize + 1)
  }

  drawDelete(p1, p2) {
    const centerP = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    }
    const angle = Math.atan2(p2.y - p1.y, p2.x  - p1.x)
    const r = 40 * unit // 先定一个斜边值
    const yH = r * Math.cos(angle)
    const xH = r * Math.sin(angle)
    console.log(yH, xH, 11111111111111111111)
    const targetP = {
      x: centerP.x + xH,
      y: centerP.y - yH
    }
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.setLineDash([])
    this.ctx.strokeStyle = "#fff"
    this.ctx.lineWidth = parseInt(3 * unit)
    this.ctx.moveTo(centerP.x, centerP.y)
    this.ctx.lineTo(targetP.x, targetP.y)
    this.ctx.stroke()
    this.drawHandleBtn(targetP)
    this.ctx.restore()
    this.drawImage(targetP)
    // 每一次旋转 延长 拖动 删除的按钮的坐标也会变 也有要从新存
    const len = this.sublineGroup.length 
    for (let i = 0; i < len; i++) {
      const item = this.sublineGroup[i]
      if (item.isChoose) {
        // 只有选中的坐标 才有可能变
        // 只需要把 当前选中的重新画 
        item.deleteP = targetP
        break
      }
    }
  }

  // 添加一条辅助线(初始化位置)
  add() {
    // 计算当前有多少条辅助线
    if (this.count === this.maxCount) return this 
    //  这里要单写划线逻辑 因为初始化辅助线需要向下顺延y
    const p1 = { x: this.startPoint.x, y: this.startPoint.y + parseInt(this.count * 50 * unit) }
    const p2 = { x: this.endPoint.x, y: this.endPoint.y + parseInt(this.count * 50 * unit) }
    // 存下新增的这条线
    this.cache(p1, p2)
    // 每次添加辅助线的时候， 其他辅助线都要取消选中
    // 所以点阵中，只有新add的线isChoose是true
    // 这时候 所有之前点击选中的都要取消
    // 新的这条要选中
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const len = this.sublineGroup.length
    for (let i = len - 1; i >= 0; i --) {
      const item = this.sublineGroup[i]
      const { p1, p2 } = item
      if (i === len - 1) {
        this.drawChooseLine(p1, p2)
        // 把有被选中的线标识置为1
        this.status = 1
      } else {
        item.isChoose = false
        this.drawCommonLine(p1, p2)
      }
    }
    return this
    // return { endX, endY }
  }

  // 判断单条线是否被选中
  isChoose(item, touchX, touchY) {
    const { p1, p2 } = item
    if (!p1 || !p2) return
    const offset = this.offset
    const { x, y } = this.position(touchX, touchY)
    const minX = Math.min(p1.x, p2.x)
    const maxX = Math.max(p1.x, p2.x)
    const minY = Math.min(p1.y, p2.y)
    const maxY = Math.max(p1.y, p2.y)
    let temp = 0
    if (Math.abs(p1.x - p2.x) <= 10) { // 有误差不能用 === 三角函数在斜率太高的时候 有bug
      // 一条垂直线
      if ((y >= minY - offset && y <= maxY + offset) && (x >= p1.x - offset && x <= p1.x + offset)) {
        item.isChoose = true
        temp = 1
      }
    } else if (Math.abs(p1.y - p2.y) <= 10) { // 有误差不能用 === 三角函数在斜率太高的时候 有bug
      // 一条水平线
      if ((x >= minX - offset && x <= maxX + offset) && (y >= p1.y - offset && y <= p1.y + offset)) {
        item.isChoose = true
        temp = 1
      }
    } else {
      // 一条倾斜线
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
      const r = Math.abs((x - p1.x) / Math.cos(angle));  // 相似三角形的斜边
      const newY = Math.sin(angle) * r; // 纵向边长度
      var projectPoint = { x, y: p1.y + newY }; // 垂直投影在直线上的点 的纵坐标
      if ((Math.abs(projectPoint.y - y) <= offset)) { // 投影点的纵坐标 - 触摸点的纵坐标 <= offset 证明被选中
          temp = 1;
      }
    }
    return temp
  }

  // 生成一个点附近 四个点的坐标
  matchArea(point) {
    return {
      minX: point.x - this.offset,
      maxX: point.x + this.offset,
      minY: point.y - this.offset,
      maxY: point.y + this.offset
    }
  }

  // 是否延长按钮 会返回延长的是哪个点的key
  isExtend(touchX, touchY) {
    if (this.status < 1) return 
    const len = this.sublineGroup.length
    const { x, y } = this.position(touchX, touchY)
    let target = null
    for (let i = len - 1; i >= 0; i--) {
      const item = this.sublineGroup[i]
      if (item.isChoose) {
        target = item
        break
      }
    }
    const { p1, p2 } = target
    const p1Area = this.matchArea(p1)
    const p2Area = this.matchArea(p2)
    if (x >= p1Area.minX && x <= p1Area.maxX && y >= p1Area.minY && y <= p1Area.maxY) { // 点击p1
      return 'p1'
    } else if (x >= p2Area.minX && x <= p2Area.maxX && y >= p2Area.minY && y <= p2Area.maxY) { // 点击p2
      return 'p2'
    } else {
      return null
    }
  }

  // 是否拖拽 
  isDrag(touchX, touchY) {
    if (this.status < 1) return 
    const item = this.sublineGroup.find(item => item.isChoose)
    // 拖拽前 判断选中的线 是不是被托拽的线
    const temp = this.isChoose(item, touchX, touchY)
    return temp === 1
  }
  
  // 是否删除按钮
  isDelete(touchX, touchY) {

  }

  //  判断是否选中了某一个辅助线
  choose(touchX, touchY) {
    return new Promise((resolve) => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const len = this.sublineGroup.length
      let hasChoose = false
      for (let i = 0; i < len; i ++) {
        const item = this.sublineGroup[i]
        const {  p1, p2 } = item
        // 判断该条线有没有被选中
        const temp = this.isChoose(item, touchX, touchY)
        // 每次点击只有可能有一个被选中
        if (temp === 1) {
          // 把有被选中的线标识置为1
          this.status = 1
          hasChoose = true
          item.isChoose = true
          this.drawChooseLine(p1, p2)
        } else {
          item.isChoose = false
          this.drawCommonLine(p1, p2)
        }
      }
      // 在判断是否选中的时候就画线
      // 同时为了减少循环 记录是否都没有被选中
      // 如果都没有就要改成false  不能只改成true 不改成false
      // 如果遍历结束 没有一个
      if (!hasChoose) {
        this.status = 0
      }
      resolve()
    })
    // const angle = Math.atan2(y2 - y1, )
  }
  
  // 延长
  extendTo(key, touchX, touchY) {
    if (this.status !== 2) return
    const { x, y } = this.position(touchX, touchY)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const len = this.sublineGroup.length
    
    for (let i = len - 1; i >= 0; i --) {
      const item = this.sublineGroup[i]
      if (item.isChoose) {
        // 将延长的点的坐标修改成新的点的坐标
        item[key] = { x, y }
        // 画被选中的辅助线
        this.drawChooseLine(item.p1, item.p2)
      } else {
        this.drawCommonLine(item.p1, item.p2)
      }
    }
  }

  // 拖拽
  drag(diffX, diffY) {
    if (this.status !== 3) return
    // console.log(diffX,diffY)
    // 这里的diffX 和 diffY 只是js原生事件的差值, 在canvas上有误差（过大） 
    // 需要将这个值 乘上 误差系数（暂且这么叫）
    // const x = diffX * (this.canvas.width / parseInt(this.elStyle.width))
    // const y = diffY * (this.canvas.height / parseInt(this.elStyle.height))
    // console.log(x, y)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const len = this.sublineGroup.length
    for (let i = 0; i < len; i++) {
      const item = this.sublineGroup[i]
      if (item.isChoose) {
        item.p1.x += diffX
        item.p2.x += diffX
        item.p1.y += diffY
        item.p2.y += diffY
        this.drawChooseLine(item.p1, item.p2)
      } else {
        this.drawCommonLine(item.p1, item.p2)
      }
    }
  }

  // 删除
  delete()  {
    
  }
}
