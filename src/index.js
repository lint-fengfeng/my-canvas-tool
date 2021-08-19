import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Toast } from 'xdf-mini-lib-test'
import 'xdf-mini-lib-test/dist/static/index.css'
// const link = document.createElement("link")
// link.setAttribute("rel", "stylesheet")
// link.setAttribute("href", "xdf-mini-lib-test/dist/static/index.css")
// document.head.appendChild(link)
const rootEl = document.getElementById('root')

Toast.init({ rootEl, duration: 100000 })

ReactDOM.render( <App />, rootEl )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
