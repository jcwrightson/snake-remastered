## Snake Remastered

### A remake of the classic snake game with some added upgrades

Demo: https://madebywrightson.com/snake-remastered

##Usage:
    
JavaScript

    const game = new Snake()
    game.init()


Markup
    
    <div>
        <canvas id="snake"></canvas>
        <canvas id="pip"></canvas>
        <canvas id="powerup"></canvas>
    
        <div class="splash">
            <div>Level: <span id="level">0</span></div>
            <div>Length: <span id="length"></span></div>
            <div>FPS: <span id="frames"></span></div>
            <div>High Score: <span id="highScore"></span></div>
        </div>
    </div>
    
    <div>
        <div>Level: <span id="level">0</span></div>
        <div>High Score: <span id="highScore"></span></div>
    </div>
