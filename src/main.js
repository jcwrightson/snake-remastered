'use strict'

import Snake from './snake'
import '../style.scss'

window.addEventListener('DOMContentLoaded', () => {
  const game = Snake()

  game.init({
    sounds: false,
    startFPS: 10,
    scaleFactor: 15,
    gameHeight: 30,
    gameWidth: 60,
  })
})
