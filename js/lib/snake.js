"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

*/
var Snake =
/*#__PURE__*/
function () {
  function Snake() {
    _classCallCheck(this, Snake);

    this.gameCanvas = document.getElementById('snake');
    this.pipCanvas = document.getElementById('pip');
    this.powerUpCanvas = document.getElementById('powerup');
    this.snake = this.gameCanvas.getContext('2d');
    this.pip = this.pipCanvas.getContext('2d');
    this.powerUp = this.powerUpCanvas.getContext('2d');
    this.snakePosition = [0, 0];
    this.pipPosition = [0, 0];
    this.powerUpPosition = [0, 0];
    this.newLevel = false;
    this.HIGH_SCORE = 0;
    this.startFPS = 12.0;
    this.scaleFactor = 15;
    this.gameHeight = 40;
    this.gameWidth = Math.floor(window.innerWidth * .45 / 10) > 100 ? 100 : Math.floor(window.innerWidth * .45 / 10);
    this.snakeBody = [];
    this.snakeLength = 5;
    this.level = 0;
    this.fps = this.startFPS;
    this.dead = true;
    this.up = false;
    this.down = true;
    this.left = false;
    this.right = false;
    this.powerUpTimer = null;
    this.colorSwitch = null;
    this.keysActive = true;
    this.gameCanvas.width = this.gameWidth * this.scaleFactor;
    this.gameCanvas.height = this.gameHeight * this.scaleFactor;
    this.pipCanvas.width = this.gameWidth * this.scaleFactor;
    this.pipCanvas.height = this.gameHeight * this.scaleFactor;
    this.powerUpCanvas.width = this.gameWidth * this.scaleFactor;
    this.powerUpCanvas.height = this.gameHeight * this.scaleFactor;
    this.snakeColor = '#f2f2f2';
    this.beep = new Audio('beep.wav');
    this.ding = new Audio('ding.flac');
    this.newHighScore = new Audio('high-score.wav');
    this.backgroundColor = '#232323';
    this.pipColor = '#d93e46';
    this.reservedColors = [this.backgroundColor, this.pipColor];
  }

  _createClass(Snake, [{
    key: "init",
    value: function init() {
      this.gameCanvas.style.backgroundColor = this.backgroundColor;

      if (localStorage.getItem("SNAKE_HIGH_SCORE")) {
        this.HIGH_SCORE = localStorage.getItem("SNAKE_HIGH_SCORE");
      } else {
        this.HIGH_SCORE = 0;
      }

      document.querySelector('.view').style.height = "".concat(this.gameHeight * this.scaleFactor, "px");
      document.getElementById('highScore').innerText = "".concat(this.HIGH_SCORE);
      document.querySelector('.splash .highscore').classList.remove('js-active');
      this.bindEventListeners();
      this.toggleDirection('down');
      requestAnimationFrame(this.gameLoop.bind(this)); // localStorage.removeItem("SNAKE_HIGH_SCORE")
    }
  }, {
    key: "stop",
    value: function stop() {
      this.dead = true;
      document.querySelector('.splash').classList.toggle('js-active');
      document.querySelector('.splash .highscore').classList.remove('js-active');

      if (this.HIGH_SCORE < this.level - 1) {
        this.HIGH_SCORE = this.level - 1;
        this.newHighScore.play();
        document.querySelector('.splash .highscore').classList.toggle('js-active');
        localStorage.setItem("SNAKE_HIGH_SCORE", this.level - 1);
        document.getElementById('highScore').innerText = "".concat(this.HIGH_SCORE);
      }
    }
  }, {
    key: "isMultiple",
    value: function isMultiple(x, multiple) {
      return x % multiple === 1;
    }
  }, {
    key: "isPixelInUse",
    value: function isPixelinUse(coords) {
      return this.snakeBody.filter(function (part) {
        return part[0] === coords[0] && part[1] === coords[1];
      }).length > 0;
    }
  }, {
    key: "areKeysActive",
    value: function areKeysActive() {
      return this.keysActive;
    }
  }, {
    key: "bindEventListeners",
    value: function bindEventListeners() {
      var _this = this;

      document.addEventListener('keydown', function (e) {
        var toggleKeysActive = function toggleKeysActive() {
          _this.keysActive = false;
          setTimeout(function () {
            _this.keysActive = true;
          }, 600 / _this.fps);
        };

        if (_this.areKeysActive()) {
          switch (e.code) {
            case 'ArrowUp':
              {
                toggleKeysActive();

                _this.toggleDirection('up');

                break;
              }

            case 'ArrowDown':
              {
                toggleKeysActive();

                _this.toggleDirection('down');

                break;
              }

            case 'ArrowLeft':
              {
                toggleKeysActive();

                _this.toggleDirection('left');

                break;
              }

            case 'ArrowRight':
              {
                toggleKeysActive();

                _this.toggleDirection('right');

                break;
              }

            case 'KeyW':
              {
                toggleKeysActive();

                _this.toggleDirection('up');

                break;
              }

            case 'KeyS':
              {
                toggleKeysActive();

                _this.toggleDirection('down');

                break;
              }

            case 'KeyA':
              {
                toggleKeysActive();

                _this.toggleDirection('left');

                break;
              }

            case 'KeyD':
              {
                toggleKeysActive();

                _this.toggleDirection('right');

                break;
              }

            case 'Space':
              {
                if (_this.dead) {
                  _this.resetGame();

                  document.querySelector('.splash').classList.toggle('js-active');
                  toggleKeysActive();
                  break;
                } else {
                  break;
                }
              }
          }
        }
      });
    }
  }, {
    key: "toggleDirection",
    value: function toggleDirection(dir) {
      var _this2 = this;

      var resetDir = function resetDir() {
        _this2.up = false;
        _this2.down = false;
        _this2.left = false;
        _this2.right = false;
      };

      var setDir = function setDir(dir) {
        if (dir === 'up') {
          _this2.up = true;
        }

        if (dir === 'down') {
          _this2.down = true;
        }

        if (dir === 'left') {
          _this2.left = true;
        }

        if (dir === 'right') {
          _this2.right = true;
        }
      };

      if (this.up && dir !== 'down' || this.down && dir !== 'up') {
        resetDir();
        setDir(dir);
      }

      if (this.left && dir !== 'right' || this.right && dir !== 'left') {
        resetDir();
        setDir(dir);
      }
    }
  }, {
    key: "move",
    value: function move() {
      if (this.right) {
        return [1, 0];
      }

      if (this.down) {
        return [0, 1];
      }

      if (this.up) {
        return [0, -1];
      }

      if (this.left) {
        return [-1, 0];
      }
    }
  }, {
    key: "randomPixel",
    value: function randomPixel() {
      return [Math.floor(Math.random() * Math.floor(this.gameWidth)) * this.scaleFactor, Math.floor(Math.random() * Math.floor(this.gameHeight)) * this.scaleFactor];
    }
  }, {
    key: "randomColor",
    value: function randomColor() {
      var rc = '#' + Math.floor(Math.random() * 16777215).toString(16);

      while (this.reservedColors.filter(function (color) {
        return color === rc;
      }).length > 0) {
        rc = '#' + Math.floor(Math.random() * 16777215).toString(16);
      }

      return rc;
    }
  }, {
    key: "doPowerUp",
    value: function doPowerUp(value, type, color, seconds) {
      var _this3 = this;

      var dropPowerUp = function dropPowerUp() {
        _this3.powerUpPosition = _this3.randomPixel();
        _this3.powerUp.value = value;
        _this3.powerUp.type = type;

        while (_this3.isPixelInUse(_this3.powerUpPosition)) {
          _this3.powerUpPosition = _this3.randomPixel();
        }

        _this3.powerUp.fillStyle = _this3.backgroundColor;

        _this3.powerUp.fillRect(_this3.powerUpPosition[0], _this3.powerUpPosition[1], _this3.scaleFactor, _this3.scaleFactor);

        var flash = true;
        _this3.colorSwitch = setInterval(function () {
          if (flash) {
            _this3.powerUp.fillStyle = color;

            _this3.powerUp.fillRect(_this3.powerUpPosition[0], _this3.powerUpPosition[1], _this3.scaleFactor, _this3.scaleFactor);
          } else {
            _this3.powerUp.fillStyle = _this3.backgroundColor;

            _this3.powerUp.fillRect(_this3.powerUpPosition[0], _this3.powerUpPosition[1], _this3.scaleFactor, _this3.scaleFactor);
          }

          flash = !flash;
        }, 100);
        _this3.powerUpTimer = setTimeout(function () {
          _this3.powerUp.clearRect(0, 0, _this3.gameWidth * _this3.scaleFactor, _this3.gameHeight * _this3.scaleFactor);

          _this3.powerUpPosition = [0, 0];
          clearInterval(_this3.colorSwitch);
          clearTimeout(_this3.powerUpTimer);
        }, seconds * 1000);
      };

      if (this.powerUpPosition === [0, 0]) {
        dropPowerUp();
      } else {
        this.powerUp.clearRect(0, 0, this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor);
        this.powerUpPosition = [0, 0];
        clearInterval(this.colorSwitch);
        clearTimeout(this.powerUpTimer);
        dropPowerUp();
      }
    }
  }, {
    key: "resetGame",
    value: function resetGame() {
      this.level = 0;
      this.fps = this.startFPS;
      this.dead = false;
      this.newLevel = true;
      this.snakePosition = [0, 0];
      this.snakeBody = [];
      this.snakeLength = 5;
      this.down = true;
      this.snakeColor = '#f2f2f2';
      this.snake.clearRect(0, 0, this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor);
      this.pip.clearRect(0, 0, this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor);
      this.powerUp.clearRect(0, 0, this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor);
      clearInterval(this.colorSwitch);
      this.toggleDirection('down');
      document.getElementById('highScore').innerText = "".concat(this.HIGH_SCORE);
    }
  }, {
    key: "buildLevel",
    value: function buildLevel() {
      this.level++;
      this.pip.fillStyle = this.pipColor;
      this.pipPosition = this.randomPixel();

      while (this.isPixelInUse(this.pipPosition)) {
        this.pipPosition = this.randomPixel();
      }

      this.pip.fillRect(this.pipPosition[0], this.pipPosition[1], this.scaleFactor, this.scaleFactor);
      this.newLevel = false;
      this.snakeLength += 2;
      this.fps += .5;

      if (this.level > 10) {
        //Speed Reduction
        if (this.fps >= 20) {
          if (this.isMultiple(this.level, Math.floor(Math.random() * Math.floor(10)))) {
            this.doPowerUp(0.3, 'speed', this.randomColor(), 5);
          }
        } //Length Reduction


        if (this.snakeLength > 40) {
          if (this.isMultiple(this.level, Math.floor(Math.random() * Math.floor(10)))) {
            this.doPowerUp(0.4, 'length', this.randomColor(), 8);
          }
        } //Change Color


        if (this.isMultiple(this.level, Math.floor(Math.random() * Math.floor(20)))) {
          var c = this.randomColor();
          this.doPowerUp(c, 'color', c, 10);
        }
      }
    }
  }, {
    key: "handleCollisions",
    value: function handleCollisions() {
      var _this4 = this;

      //Detect Pip Collision
      if (this.pipPosition[0] === this.snakePosition[0] && this.pipPosition[1] === this.snakePosition[1]) {
        this.ding.play();
        this.newLevel = true;
        this.pip.clearRect(this.pipPosition[0], this.pipPosition[1], this.scaleFactor, this.scaleFactor);
      } //Detect PowerUp Collision


      if (this.powerUpPosition !== [0, 0]) {
        if (this.powerUpPosition[0] === this.snakePosition[0] && this.powerUpPosition[1] === this.snakePosition[1]) {
          if (this.powerUp.type !== 'color') {
            this.beep.play();
          }

          this.powerUp.clearRect(0, 0, this.gameWidth * this.scaleFactor, this.gameHeight * this.scaleFactor);

          if (this.powerUp.type === 'color') {
            this.snakeColor = this.powerUp.value;
          }

          if (this.powerUp.type === 'speed') {
            var reduction = Math.abs(this.fps * this.powerUp.value);

            if (this.fps - reduction > this.startFPS) {
              this.fps = this.fps - reduction;
            } else {
              this.fps = this.startFPS;
            }
          }

          if (this.powerUp.type === 'length') {
            var partsToRemove = Math.round(this.snakeLength * this.powerUp.value);

            for (var i = 0; i < partsToRemove; i++) {
              this.snake.clearRect(this.snakeBody[this.snakeLength - 1][0], this.snakeBody[this.snakeLength - 1][1], this.scaleFactor, this.scaleFactor);
              this.snakeBody.pop();
              this.snakeLength--;
            }
          } //Clear


          clearInterval(this.powerUpTimer);
          clearTimeout(this.colorSwitch);
          this.powerUpPosition = [0, 0];
        }
      } //Detect Bounds Collision


      if (this.snakePosition[0] < 0 || this.snakePosition[0] === this.gameWidth * this.scaleFactor || this.snakePosition[1] < 0 || this.snakePosition[1] === this.gameHeight * this.scaleFactor) {
        this.stop();
      } //Detect Self Collision


      var hitSelf = function hitSelf() {
        return _this4.snakeBody.map(function (part, index) {
          if (index > 0) {
            return part[0] === _this4.snakePosition[0] && part[1] === _this4.snakePosition[1];
          }
        }).filter(function (res) {
          return res === true;
        });
      };

      if (hitSelf().length > 0) {
        this.stop();
      }
    }
  }, {
    key: "gameLoop",
    value: function gameLoop() {
      var _this5 = this;

      if (!this.dead) {
        if (this.newLevel) {
          this.buildLevel();
        }

        this.snake.fillStyle = this.snakeColor; //Update Snake Coords [TIP]

        this.snakePosition[0] += this.move()[0] * this.scaleFactor;
        this.snakePosition[1] += this.move()[1] * this.scaleFactor;

        if (this.snakeBody.length < this.snakeLength) {
          this.snakeBody.unshift(_toConsumableArray(this.snakePosition));
        } else {
          var filtered = this.snakeBody.filter(function (item, index) {
            return index !== _this5.snakeLength - 1;
          });
          filtered.unshift(_toConsumableArray(this.snakePosition));
          this.snakeBody = _toConsumableArray(filtered);
        }

        this.snake.fillRect(this.snakePosition[0], this.snakePosition[1], this.scaleFactor, this.scaleFactor); //Collisions

        this.handleCollisions();
      } //Loop


      setTimeout(function () {
        if (_this5.snakeBody.length === _this5.snakeLength) {
          _this5.snake.clearRect(_this5.snakeBody[_this5.snakeLength - 1][0], _this5.snakeBody[_this5.snakeLength - 1][1], _this5.scaleFactor, _this5.scaleFactor);
        } //Output


        document.getElementById('frames').innerText = "".concat(Math.floor(_this5.fps));
        document.getElementById('length').innerText = _this5.snakeLength;
        document.getElementById('level').innerText = "".concat(_this5.level);

        _this5.gameLoop();
      }, 1000 / this.fps);
    }
  }]);

  return Snake;
}();