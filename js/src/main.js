
let useAI = false

const toggleAI = () => {
    useAI = !useAI

    if(useAI){
        document.getElementById('aiBtn').innerText = "AI On"
        document.getElementById('aiBtn').classList.add('js-active')
    }else{
        document.getElementById('aiBtn').innerText = "AI Off"
        document.getElementById('aiBtn').classList.remove('js-active')
    }
}

window.addEventListener("DOMContentLoaded", ()=>{
    const game = new Snake()
    game.init()

    const gW = (game.gameWidth * game.scaleFactor) - game.scaleFactor
    const gH = (game.gameHeight * game.scaleFactor) - game.scaleFactor

    const moves = ['up', 'down', 'left', 'right']

    const moveVector = (dir) => {

       switch (dir) {
            case 'up' : {
                return [0, -1]
            }
            case 'down' : {
                return [0, 1]
            }
            case 'left' : {
                return [-1, 0]
            }
            case 'right' : {
                return [1, 0]
            }
        }
    }



    const AI = () => {

        if(!game.dead && useAI) {

            document.getElementById('snakePosition').innerText = game.snakePosition
            // document.getElementById('pipPosition').innerText = game.pipPosition


            const withinBounds = (arr) =>{
                return (arr[0] <= gW && arr[0] >= 0) && (arr[1] <= gH && arr[1] >= 0)
            }

            const predictVector = (move) => {
                return [
                    game.snakePosition[0] + (moveVector(move)[0] * game.scaleFactor),
                    game.snakePosition[1] + (moveVector(move)[1] * game.scaleFactor)
                ]

            }

            const validDirection = (direction) => {

                switch (game.getCurrentDirection()) {
                    case 'up' : {
                        return direction !== 'down'
                    }
                    case 'down' : {
                        return direction !== 'up'
                    }
                    case 'left' : {
                        return direction !== 'right'
                    }
                    case 'right' : {
                        return direction !== 'left'
                    }

                }
            }

            const isValidMove = (vector, direction) =>{

                //ToDo: Avoid dead ends...

                return (validDirection(direction) && withinBounds(vector) && !game.isPixelInUse(vector))
            }


            let currentMove = [
                game.snakePosition[0] + (moveVector(game.getCurrentDirection())[0] * game.scaleFactor), // Width
                game.snakePosition[1] + (moveVector(game.getCurrentDirection())[1] * game.scaleFactor)  // Height
            ]

            const FindValidMove = () => {

                currentMove = [
                    game.snakePosition[0] + (moveVector(game.getCurrentDirection())[0] * game.scaleFactor),
                    game.snakePosition[1] + (moveVector(game.getCurrentDirection())[1] * game.scaleFactor)
                ]

                moves.map(direction => {

                    if(isValidMove(predictVector(direction), direction)){
                        document.getElementById('move').innerText = direction
                        game.toggleDirection(direction)
                    }

                })
            }

            while(!isValidMove(currentMove, game.getCurrentDirection())){
                FindValidMove()
            }

            const calcD2T = (snakePosition) => {
                return [
                    Math.abs(snakePosition[0] - game.pipPosition[0]),
                    Math.abs(snakePosition[1] - game.pipPosition[1])
                ]
            }

            const hunt = () => {
                const d2T = calcD2T(game.snakePosition)
                document.getElementById('distance').innerText = d2T

                const doMove = (d) => {
                    document.getElementById('move').innerText = d
                    game.toggleDirection(d)
                }

                //[100, 100]

                moves.map(direction => {
                    const pV = predictVector(direction)
                    // console.log(pV)
                    if(isValidMove(pV, direction)){

                        if(calcD2T(pV)[0] <= d2T[0] && calcD2T(pV)[1] <= d2T[1]){
                            doMove(direction)
                        }else {
                            if(calcD2T(pV)[0] === 0){
                                if(calcD2T(pV)[1] <= d2T[1]){
                                    doMove(direction)
                                }
                            }
                        }

                    }
                })

            }

            hunt()

            document.getElementById('currentMove').innerText = currentMove

        }

        setTimeout(()=>{
                AI()
        }, 1000 / game.fps)

    }

    requestAnimationFrame(AI)
})
