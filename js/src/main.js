
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

        if(!game.dead) {

            document.getElementById('snakePosition').innerText = game.snakePosition
            document.getElementById('pipPosition').innerText = game.pipPosition


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

            document.getElementById('currentMove').innerText = currentMove

        }


        setTimeout(()=>{
            AI()
        }, 1000 / game.fps)

    }

    requestAnimationFrame(AI)
})
