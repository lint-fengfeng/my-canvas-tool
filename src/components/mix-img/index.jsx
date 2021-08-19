import React, { Component} from 'react'
import {mixImg} from 'mix-img'

const mixConfig = {
    "base": {
      "backgroundImg": "https://seal-1252350207.cos.ap-beijing.myqcloud.com/seal/wechat-mini/testimg/9df780d1-71af-47dc-a357-c61aaff60bea.png",
      "width": 375,
      "height": 667,
      "quality": 0.8,
      "fileType": "png",
      "dataType": "canvas"
    },
    "qrCode": {
      "width": 100,
      "height": 100,
      "text": "{avatarUrl}",
      "x": 270,
      "y": 573,
      "correctLevel": 1
    },
    "dynamic": [
      {
        "type": 2,
        "position": {
          "x": 187,
          "y": 350
        },
        "style": {
          "fontSize": 34,
          "color": "#ffebc0",
          "textAlign": "center",
          "fontWeight": "bold"
        },
        "text": "{variate}"
      },
      {
        "type": 1,
        "position": {
          "x": 162,
          "y": 200
        },
        "size": {
          "dWidth": 50,
          "dHeight": 50
        },
        "imgUrl": "https://yn-seal-test-1300564492.cos.ap-beijing.myqcloud.com/exam/test/files3/exercise/plan/task/cos/shareImage/2021/1/13/483173bd-8785-4fa1-97e5-a9552dfc6328.png",
        "isRound": true
      }
    ],
    "replaceText": {
      "variate": "新东方",
      "avatarUrl": "https://seal-1252350207.cos.ap-beijing.myqcloud.com//exam/pro/files2/exercise/plan/answerImage/2021/3/11/8f361eec-25cd-4fe6-8bb9-17327bd6c70d.jpg"
    }
}

export default class MyDraw extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.ctx = null
  }

  static propTypes = {};
  static defaultProps = {};

  componentDidMount() { }

  toImage = async () => {
    const res = await mixImg(mixConfig)
    console.log(res)
    const canvas = res.data.canvas
    document.querySelector("#aaa").appendChild(canvas)
    const base64 = canvas.toDataURL()
    const img = new Image; img.src = base64
    img.onload =function () {
      document.querySelector("#aaa").appendChild(this)
    }
  }

  render() {
    return (<>
      <div id='aaa'>
        <div>
          <button onClick={this.toImage}>生成图片</button>
        </div>
        <div><img src="" alt="" /></div>
      </div>
    </>)
  }
}