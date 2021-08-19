import React, { Component } from 'react'
// import MixImg from './components/mix-img'
// import MyDraw from './components/my-draw'
import './index.scss'
const elArr = [
  {
    title: [
      '女装',
      '内衣',
      "家居"
    ],
    contents: [
      {
        subTitle: '女装',
        subList: [
          'T恤', '纺织衫'
        ]
      },
      {
        subTitle: '男装',
        subList: [
          'T恤', '纺织衫'
        ]
      }
    ]
  },
  {
    title: [
      '母婴',
      '童装',
      "玩具"
    ],
    contents: [
      {
        subTitle: '女装',
        subList: [
          'T恤', '纺织衫'
        ]
      },
      {
        subTitle: '男装',
        subList: [
          'T恤', '纺织衫'
        ]
      }
    ]
  },
  {
    title: [
      '美妆',
      '彩妆',
      "个护"
    ],
    contents: [
      {
        subTitle: '女装',
        subList: [
          'T恤', '纺织衫'
        ]
      },
      {
        subTitle: '男装',
        subList: [
          'T恤', '纺织衫'
        ]
      }
    ]
  },
]

export default class SideBar extends Component {
  renderContent = (sup) => {
    return sup.contents && sup.contents.map(content => {
      return <>
        <div className="title">{content.subTitle}</div>
        {
          content.subList && content.subList.map(text => {
            return <span className="text">{text}</span>
          })
        }
      </>
    })
  }

  renderSideBar = () => {
    return elArr && elArr.map((sup, index) => {
      return (
        <div key={index} className="normal">
          {
            sup.title && sup.title.map((sub, i, arr) => {
              return <div className="a">
                <a href="javascript:void(0)">
                  {sub + (i === arr.length -1 ? '' : '/')}
                </a>
                {
                  i === arr.length -1 && <span className="left">></span>
                }
              </div>
            })
          }
          <div className="content">
            {
              this.renderContent(sup)
            }
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="sideBar">
        {
          this.renderSideBar()
        }
      </div>
    )
  }
}
