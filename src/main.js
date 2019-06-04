"use strict";

import Snake from './snake'
import '../style.scss'

window.addEventListener("DOMContentLoaded", ()=>{
	return Snake({
		sounds: false,
		startFPS: 15,
		scaleFactor:15
	})
})
