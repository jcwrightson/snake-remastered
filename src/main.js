'use strict'

import Snake from './snake'
import '../style.scss'

const calcWidth = () => {
  const w = Math.floor(window.innerWidth / 20 - window.innerWidth * 0.01)
  return w
}

const calcHeight = () => {
  const h = Math.floor(window.innerHeight / 25 - window.innerHeight * 0.01)
  return h
}

window.addEventListener('DOMContentLoaded', () => {
  const game = Snake()

  game.init({
    sounds: false,
    startFPS: 10,
    scaleFactor: 15,
    gameHeight: calcHeight(),
    gameWidth: calcWidth() > 60 ? 60 : calcWidth(),
  })

  let gamePixWidth = document.getElementById('snake').clientWidth
  document.querySelector('main.game').style.width = gamePixWidth + 'px'
})
