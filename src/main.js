"use strict";

import Snake from './snake'
import '../style.scss'

window.addEventListener("DOMContentLoaded", ()=>{
	const game = new Snake()

	game.init({
		sounds: false,
		startFPS: 12
	})
})
