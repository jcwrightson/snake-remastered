/*
    JS Snake
    jcwrightson@gmail.com
    https://jcwrightson.com

    USAGE:

    const game = new Snake()
    game.init()

    MARKUP:

    <div>
        <canvas id="snake"></canvas>
        <canvas id="pip"></canvas>
        <canvas id="powerup"></canvas>

        <div class="splash">
            <div class="highscore">New High Score!!</div>
            <div>Press [SPACE] to Start</div>
        </div>
    </div>

    <div>
        <div>Level: <span id="level">0</span></div>
        <div>High Score: <span id="highScore"></span></div>
    </div>

*/

class Snake {
     constructor(){
         this.gameCanvas = document.getElementById('snake')
         this.pipCanvas = document.getElementById('pip')
         this.powerUpCanvas = document.getElementById('powerup')

         this.snake = this.gameCanvas.getContext('2d')
         this.pip = this.pipCanvas.getContext('2d')
         this.powerUp = this.powerUpCanvas.getContext('2d')

         this.snakePosition = [0,0]
         this.pipPosition = [0, 0]
         this.powerUpPosition = [0, 0]

         this.newLevel = false
         this.HIGH_SCORE = 0
         this.startFPS = 12
         this.scaleFactor = 15
         this.gameHeight = 40
         this.gameWidth = 60
         this.snakeBody = []
         this.snakeLength = 5
         this.keyPressTimeout = 50
         this.level = 0
         this.fps = this.startFPS
         this.dead = true
         this.up = false
         this.down = true
         this.left = false
         this.right = false
         this.powerUpTimer = null
         this.colorSwitch = null
         this.keysActive = true


         this.gameCanvas.width = this.gameWidth * this.scaleFactor
         this.gameCanvas.height = this.gameHeight * this.scaleFactor
         this.pipCanvas.width = this.gameWidth * this.scaleFactor
         this.pipCanvas.height = this.gameHeight * this.scaleFactor
         this.powerUpCanvas.width = this.gameWidth * this.scaleFactor
         this.powerUpCanvas.height = this.gameHeight * this.scaleFactor

         this.beep = new Audio('beep.wav')
         this.ding = new Audio('ding.flac')
         this.newHighScore = new Audio('high-score.wav')

         this.backgroundColor = '#232323'


     }

     init(){
         this.bindEventListeners()

         document.querySelector('.splash .highscore').classList.remove('js-active')

         if(localStorage.getItem("SNAKE_HIGH_SCORE")){
             this.HIGH_SCORE = localStorage.getItem("SNAKE_HIGH_SCORE")
         }else {
             this.HIGH_SCORE = 0
         }

         this.gameCanvas.style.backgroundColor = this.backgroundColor
         document.querySelector('.view').style.height = `${this.gameHeight * this.scaleFactor}px`
         document.getElementById('highScore').innerText = `${this.HIGH_SCORE}`

         this.toggleDirection('down')
         requestAnimationFrame(this.gameLoop.bind(this))


         // localStorage.removeItem("SNAKE_HIGH_SCORE")
     }

     stop(){

         this.dead = true
         document.querySelector('.splash').classList.toggle('js-active')
         document.querySelector('.splash .highscore').classList.remove('js-active')

         if(this.HIGH_SCORE < this.level - 1){
             this.HIGH_SCORE = this.level - 1
             this.newHighScore.play()
             document.querySelector('.splash .highscore').classList.toggle('js-active')
             localStorage.setItem("SNAKE_HIGH_SCORE", this.level - 1)
             document.getElementById('highScore').innerText = `${this.HIGH_SCORE}`
         }


     }

     areKeysActive(){
         return this.keysActive
     }

     isPixelinUse(coords){
         return this.snakeBody.filter(part => {
             return part[0] === coords[0] && part[1] === coords[1]
         }).length > 0
     }

     bindEventListeners(){

         document.addEventListener('keydown', (e)=>{
             const toggleKeysActive = () => {
                 this.keysActive = false
                 setTimeout(()=>{
                     this.keysActive = true
                 }, this.keyPressTimeout)
             }

             if(this.areKeysActive()) {
                 switch (e.code) {
                     case 'ArrowUp' : {
                         toggleKeysActive()
                         this.toggleDirection('up')
                         break
                     }
                     case 'ArrowDown' : {
                         toggleKeysActive()
                         this.toggleDirection('down')
                         break
                     }
                     case 'ArrowLeft' : {
                         toggleKeysActive()
                         this.toggleDirection('left')
                         break
                     }
                     case 'ArrowRight' : {
                         toggleKeysActive()
                         this.toggleDirection('right')
                         break
                     }
                     case 'Space' : {
                         if(this.dead){
                             this.resetGame()
                             document.querySelector('.splash').classList.toggle('js-active')
                             toggleKeysActive()
                             break
                         }else{
                             break
                         }
                     }
                 }
             }
         })

     }


    toggleDirection(dir){

        const resetDir = () => {
            this.up = false
            this.down = false
            this.left = false
            this.right = false
        }

        const setDir = (dir) => {
            if(dir === 'up'){
                this.up = true
            }

            if(dir === 'down'){
                this.down = true
            }

            if(dir === 'left'){
                this.left = true
            }

            if(dir === 'right'){
                this.right = true
            }
        }

        if(this.up && dir !== 'down' || this.down && dir !== 'up'){
            resetDir()
            setDir(dir)
        }

        if(this.left && dir !== 'right' || this.right && dir !== 'left'){
            resetDir()
            setDir(dir)
        }


    }

    randomPixel(){
        return [
            Math.floor(Math.random() * Math.floor(this.gameWidth)) * this.scaleFactor,
            Math.floor(Math.random() * Math.floor(this.gameHeight)) * this.scaleFactor
        ]
    }


    doPowerUp(value, type, color, seconds){

         const dropPowerUp = ()=>{
             this.powerUpPosition = this.randomPixel()
             this.powerUp.value = value
             this.powerUp.type = type

             while (this.isPixelinUse(this.powerUpPosition)) {
                 this.powerUpPosition = this.randomPixel()
             }

             this.powerUp.fillRect(this.powerUpPosition[0], this.powerUpPosition[1], this.scaleFactor, this.scaleFactor)

             let flash = true
             this.colorSwitch = setInterval(() => {
                 if (flash) {
                     this.powerUp.fillStyle = color
                     this.powerUp.fillRect(this.powerUpPosition[0], this.powerUpPosition[1], this.scaleFactor, this.scaleFactor)
                 } else {
                     this.powerUp.fillStyle = this.backgroundColor
                     this.powerUp.fillRect(this.powerUpPosition[0], this.powerUpPosition[1], this.scaleFactor, this.scaleFactor)
                 }

                 flash = !flash

             }, 100)

             this.powerUpTimer = setTimeout(() => {
                 this.powerUp.clearRect(0, 0, this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor)
                 this.powerUpPosition = [0, 0]
                 clearInterval(this.colorSwitch)
                 clearTimeout(this.powerUpTimer)
             }, seconds * 1000)
         }

        if(this.powerUpPosition === [0,0]) {
           dropPowerUp()
        }else{
            this.powerUp.clearRect(0, 0, this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor)
            this.powerUpPosition = [0, 0]
            clearInterval(this.colorSwitch)
            clearTimeout(this.powerUpTimer)
            dropPowerUp()
        }
    }

    move(){
        if(this.right){
            return[1, 0]
        }

        if(this.down){
            return[0, 1]
        }

        if(this.up){
            return[0, -1]
        }

        if(this.left){
            return[-1, 0]
        }
    }

    resetGame(){
        this.level = 0
        this.fps = this.startFPS
        this.dead = false
        this.newLevel = true
        this.snakePosition = [0,0]
        this.snakeBody = []
        this.snakeLength = 5
        this.down = true

        this.snake.clearRect(0,0, this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor)
        this.pip.clearRect(0, 0 , this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor)
        this.powerUp.clearRect(0, 0 , this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor)
        clearInterval(this.colorSwitch)
        this.toggleDirection('down')


        document.getElementById('highScore').innerText = `${this.HIGH_SCORE}`

    }


    gameLoop(){

        if(!this.dead) {

            if(this.newLevel){
                this.level++
                this.pip.fillStyle = '#eb5050'
                this.pipPosition = this.randomPixel()

                while(this.isPixelinUse(this.pipPosition)){
                    this.pipPosition = this.randomPixel()
                }

                this.pip.fillRect(this.pipPosition[0], this.pipPosition[1], this.scaleFactor, this.scaleFactor)
                this.newLevel = false

                document.getElementById('level').innerText = `${this.level}`

                this.snakeLength += 2
                this.fps += .5


                if(this.level > 1) {
                    if (this.level % 10 === 1) {
                        this.doPowerUp(Math.abs(this.level * 0.1), "length", '#19db00', 8)
                    }else {
                        if (this.level % 6 === 1) {
                            this.doPowerUp(2, "speed", '#ffa91e', 5)
                        }
                    }
                }
            }

            this.snake.fillStyle = '#f2f2f2'

            //Update Snake Coords [TIP]
            this.snakePosition[0] += (this.move()[0] * this.scaleFactor)
            this.snakePosition[1] += (this.move()[1] * this.scaleFactor)

            if(this.snakeBody.length < this.snakeLength){
                this.snakeBody.unshift([...this.snakePosition])
            }else{
                const filtered = this.snakeBody.filter((item, index) => {return index !== this.snakeLength - 1})
                filtered.unshift([...this.snakePosition])
                this.snakeBody = [...filtered]
            }

            this.snake.fillRect(this.snakePosition[0], this.snakePosition[1], this.scaleFactor, this.scaleFactor)

            //Detect Pip Collision
            if(this.pipPosition[0] === this.snakePosition[0] && this.pipPosition[1] === this.snakePosition[1]){
                this.ding.play()
                this.newLevel = true
                this.pip.clearRect(this.pipPosition[0], this.pipPosition[1], this.scaleFactor, this.scaleFactor)
            }

            //Detect PowerUp Collision
            if(this.powerUpPosition !== [0, 0]) {
                if (this.powerUpPosition[0] === this.snakePosition[0] && this.powerUpPosition[1] === this.snakePosition[1]) {
                    this.beep.play()
                    this.powerUp.clearRect(0, 0, this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor)
                    clearInterval(this.powerUpTimer)
                    clearTimeout(this.colorSwitch)

                    this.powerUpPosition = [0, 0]

                    if(this.powerUp.type === 'speed') {
                        this.fps = this.fps - this.powerUp.value
                    }

                    if(this.powerUp.type === 'length'){

                        for (let i = 0; i < this.powerUp.value; i++) {

                            this.snake.clearRect(this.snakeBody[this.snakeLength - 1][0], this.snakeBody[this.snakeLength - 1][1], this.scaleFactor, this.scaleFactor)
                            this.snakeBody.pop()
                            this.snakeLength--
                        }

                    }
                }
            }

            //Detect Bounds Collision
            if((this.snakePosition[0] < 0 || this.snakePosition[0] === this.gameWidth * this.scaleFactor) || (this.snakePosition[1] < 0 || this.snakePosition[1] === this.gameHeight * this.scaleFactor)){
                this.stop()
            }

            //Detect Self Collision
            const hitSelf = () =>{
                return this.snakeBody.map((part, index) => {
                    if(index > 0) {
                        return part[0] === this.snakePosition[0] && part[1] === this.snakePosition[1]
                    }
                }).filter(res => res === true)
            }

            if(hitSelf().length > 0){
                this.stop()
            }

        }


        //Loop
        setTimeout(()=>{

            if(this.snakeBody.length === this.snakeLength) {
                this.snake.clearRect(this.snakeBody[this.snakeLength - 1][0], this.snakeBody[this.snakeLength - 1][1], this.scaleFactor, this.scaleFactor)
            }
            this.gameLoop()
        }, 1000 / this.fps)


    }
}