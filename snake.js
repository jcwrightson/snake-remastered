//JS Snake
//Author: jcwrightson@gmail.com

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
         this.startFPS = 15
         this.scaleFactor = 15
         this.gameHeight = 40
         this.gameWidth = 60
         this.snakeBody = []
         this.snakeLength = 5
         this.level = 0
         this.fps = this.startFPS
         this.dead = true
         this.up = false
         this.down = false
         this.left = false
         this.right = false
         this.powerUpTimer = null
         this.colorSwitch = null

         this.gameCanvas.width = this.gameWidth * this.scaleFactor
         this.gameCanvas.height = this.gameHeight * this.scaleFactor
         this.pipCanvas.width = this.gameWidth * this.scaleFactor
         this.pipCanvas.height = this.gameHeight * this.scaleFactor
         this.powerUpCanvas.width = this.gameWidth * this.scaleFactor
         this.powerUpCanvas.height = this.gameHeight * this.scaleFactor

     }

     init(){
         this.bindEventListeners()

         if(localStorage.getItem("SNAKE_HIGH_SCORE")){
             this.HIGH_SCORE = localStorage.getItem("SNAKE_HIGH_SCORE")
         }else {
             this.HIGH_SCORE = 0
         }

         this.gameCanvas.style.backgroundColor = '#232323'
         document.querySelector('.view').style.height = `${this.gameHeight * this.scaleFactor}px`
         document.getElementById('highScore').innerText = `${this.HIGH_SCORE}`

         this.toggleDirection('down')
         requestAnimationFrame(this.gameLoop.bind(this))
     }

     stop(){
         this.dead = true
         document.querySelector('.splash').classList.toggle('js-active')
     }

     bindEventListeners(){
         document.addEventListener('keydown', (e)=>{
             if(e.code === 'Space' && this.dead){
                 this.resetGame()
                 document.querySelector('.splash').classList.toggle('js-active')
             }
         })

         document.addEventListener('keydown', (e)=>{
             if(e.code === 'ArrowUp'){
                 this.toggleDirection('up')
             }
         })

         document.addEventListener('keydown', (e)=>{
             if(e.code === 'ArrowDown'){
                 this.toggleDirection('down')
             }
         })

         document.addEventListener('keydown', (e)=>{
             if(e.code === 'ArrowLeft'){
                 this.toggleDirection('left')
             }
         })

         document.addEventListener('keydown', (e)=>{
             if(e.code === 'ArrowRight'){
                 this.toggleDirection('right')
             }
         })

     }

    toggleDirection(dir){
        this.up = false
        this.down = false
        this.left = false
        this.right = false

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

    randomPixel(){
        return [Math.floor(Math.random() * Math.floor(this.gameWidth)) * this.scaleFactor,
            Math.floor(Math.random() * Math.floor(this.gameHeight)) * this.scaleFactor]
    }

    doPowerUp(){

        this.powerUp.fillStyle = '#ffa91e'
        this.powerUpPosition[0] = this.randomPixel()[0]
        this.powerUpPosition[1] = this.randomPixel()[1]
        this.powerUp.fillRect(this.powerUpPosition[0], this.powerUpPosition[1], this.scaleFactor, this.scaleFactor)

        let flash = false
        this.colorSwitch = setInterval(()=>{

            if(flash){
                this.powerUp.fillStyle = '#ffa91e'
                this.powerUp.fillRect(this.powerUpPosition[0], this.powerUpPosition[1], this.scaleFactor, this.scaleFactor)
            }else{
                this.powerUp.fillStyle = '#ffd100'
                this.powerUp.fillRect(this.powerUpPosition[0], this.powerUpPosition[1], this.scaleFactor, this.scaleFactor)
            }

            flash = !flash

        }, 200)

        this.powerUpTimer = setTimeout(()=>{
            this.powerUp.clearRect(0, 0,  this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor)
            this.powerUpPosition = [0, 0]
            clearInterval(this.colorSwitch)
            clearTimeout(this.powerUpTimer)
        }, 5000)
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
                this.pipPosition[0] = this.randomPixel()[0]
                this.pipPosition[1] = this.randomPixel()[1]

                this.pip.fillRect(this.pipPosition[0], this.pipPosition[1], this.scaleFactor, this.scaleFactor)
                this.newLevel = false
                document.getElementById('level').innerText = `${this.level}`


                this.snakeLength += 2
                this.fps += .5

                if((this.level % 8 === 1) && this.level !== 1){
                    this.doPowerUp()
                }

            }

            this.snake.fillStyle = '#fafafa'

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
                this.newLevel = true
                this.pip.clearRect(this.pipPosition[0], this.pipPosition[1], this.scaleFactor, this.scaleFactor)
            }

            //Detect PowerUp Collision
            if(this.powerUpPosition[0] === this.snakePosition[0] && this.powerUpPosition[1] === this.snakePosition[1]){
                this.powerUp.clearRect(0, 0,  this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor)
                clearInterval(this.powerUpTimer)
                clearTimeout(this.colorSwitch)

                this.powerUpPosition = [0, 0]
                this.fps = this.fps - 4
            }

            //Detect Bounds Collision
            if((this.snakePosition[0] < 0 || this.snakePosition[0] === this.gameWidth * this.scaleFactor) || (this.snakePosition[1] < 0 || this.snakePosition[1] === this.gameHeight * this.scaleFactor)){
                this.stop()
            }

            //ToDo: Detect Self Collision
            const hitSelf = () =>{
                return this.snakeBody.map((position , index)=>{
                    if(index > 0) {
                        return this.snakePosition[0] === position[0] && this.snakePosition[1] === position[1]
                    }
                    return false
                })
            }

        }else{
            if(this.HIGH_SCORE < this.level - 1){
                localStorage.setItem("SNAKE_HIGH_SCORE", this.level - 1)
                document.getElementById('highScore').innerText = `${this.HIGH_SCORE}`
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