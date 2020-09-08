'use strict'

import Snake from './snake'
import '../style.scss'

window.addEventListener('DOMContentLoaded', () => {
  Snake({
    sounds: false,
    startFPS: 10,
    scaleFactor: 15,
    gameHeight: 30,
    gameWidth: 60,
  })
})
