"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var useAI = false;

var toggleAI = function toggleAI() {
  useAI = !useAI;

  if (useAI) {
    document.getElementById('aiBtn').innerText = "AI On";
    document.getElementById('aiBtn').classList.add('js-active');
  } else {
    document.getElementById('aiBtn').innerText = "AI Off";
    document.getElementById('aiBtn').classList.remove('js-active');
  }
};

window.addEventListener("DOMContentLoaded", function () {
  var game = new Snake();
  game.init({
    sounds: false,
    startFPS: 15
  });
  var gW = game.gameWidth * game.scaleFactor - game.scaleFactor;
  var gH = game.gameHeight * game.scaleFactor - game.scaleFactor;
  var moves = ['up', 'down', 'left', 'right'];
  var moveHistory = [];
  var moveHistorySize = moves.length;

  var moveVector = function moveVector(dir) {
    switch (dir) {
      case 'up':
        {
          return [0, -1];
        }

      case 'down':
        {
          return [0, 1];
        }

      case 'left':
        {
          return [-1, 0];
        }

      case 'right':
        {
          return [1, 0];
        }
    }
  };

  var AI = function AI() {
    if (!game.dead && useAI) {
      document.getElementById('snakePosition').innerText = game.snakePosition; // document.getElementById('pipPosition').innerText = game.pipPosition

      var withinBounds = function withinBounds(arr) {
        return arr[0] <= gW && arr[0] >= 0 && arr[1] <= gH && arr[1] >= 0;
      };

      var nextVector = function nextVector(move) {
        return [game.snakePosition[0] + moveVector(move)[0] * game.scaleFactor, game.snakePosition[1] + moveVector(move)[1] * game.scaleFactor];
      };

      var validDirection = function validDirection(direction) {
        switch (game.getCurrentDirection()) {
          case 'up':
            {
              return direction !== 'down';
            }

          case 'down':
            {
              return direction !== 'up';
            }

          case 'left':
            {
              return direction !== 'right';
            }

          case 'right':
            {
              return direction !== 'left';
            }
        }
      };

      var closestVector = function closestVector(vA, vB) {
        if (vA[0] + vA[1] <= vB[0] + vB[1]) {
          return vA;
        }

        return vB;
      };

      var isValidMove = function isValidMove(vector, direction) {
        //ToDo: Avoid dead ends...
        return validDirection(direction) && withinBounds(vector) && !game.isSnakeBody(vector);
      };

      var calcD2T = function calcD2T(snakePosition) {
        if (game.powerUpActive) {
          return closestVector([Math.abs(snakePosition[0] - game.pipPosition[0]), Math.abs(snakePosition[1] - game.pipPosition[1])], [Math.abs(snakePosition[0] - game.powerUpPosition[0]), Math.abs(snakePosition[1] - game.powerUpPosition[1])]);
        } else {
          return [Math.abs(snakePosition[0] - game.pipPosition[0]), Math.abs(snakePosition[1] - game.pipPosition[1])];
        }
      };

      var recordMove = function recordMove(moveArr) {
        if (moveHistory.length < moveHistorySize) {
          moveHistory.unshift(moveArr);
        } else {
          moveHistory.unshift(moveArr);
          moveHistory.pop();
        }
      };

      var _currentMove = [game.snakePosition[0] + moveVector(game.getCurrentDirection())[0] * game.scaleFactor, // Width
      game.snakePosition[1] + moveVector(game.getCurrentDirection())[1] * game.scaleFactor // Height
      ];
      var validMoves = [];

      var isSquareMove = function isSquareMove(moveDirection) {
        var m = _toConsumableArray(moveHistory.map(function (move) {
          return move[1];
        }));

        var mVs = [].concat(moves);
        m.unshift(moveDirection);

        var ism = function ism() {
          m.map(function (d) {
            mVs = mVs.filter(function (m) {
              return m !== d;
            });
          });
          return mVs.length === 0;
        };

        if (m.length === moves.length) {
          return ism();
        } else {
          if (m.length > moves.length) {
            m.pop();
            return ism();
          } else return false;
        }
      };

      var handleMove = function handleMove() {
        if (validMoves.length > 0) {
          if (validMoves[0][1] !== game.getCurrentDirection()) {
            document.getElementById('move').innerText = validMoves[0][1];

            var defaultMove = function defaultMove() {
              recordMove([validMoves[0][0], validMoves[0][1]]);
              game.toggleDirection(validMoves[0][1]);
            };

            if (validMoves.length > 1) {
              if (!isSquareMove(validMoves[0][1])) {
                defaultMove();
              } else {
                recordMove([validMoves[1][0], validMoves[1][1]]);
                game.toggleDirection(validMoves[1][1]);
              }
            } else {
              defaultMove();
            }
          }
        }
      };

      var hunt = function hunt() {
        validMoves = [];
        var d2T = calcD2T(game.snakePosition);
        document.getElementById('distance').innerText = d2T;
        moves.map(function (direction) {
          var nV = nextVector(direction);

          if (isValidMove(nV, direction)) {
            if (calcD2T(nV)[0] < d2T[0] || calcD2T(nV)[1] < d2T[1]) {
              validMoves.push([nV, direction]);
            }
          }
        });
        handleMove();
      };

      var FindValidMove = function FindValidMove() {
        moves.map(function (direction) {
          if (isValidMove(nextVector(direction), direction)) {
            document.getElementById('move').innerText = direction;
            validMoves.push([nextVector(direction), direction]);
          }
        });
      };

      if (!isValidMove(_currentMove, game.getCurrentDirection())) {
        FindValidMove();
        handleMove();
      } else {
        hunt();
      }
    }

    document.getElementById('currentMove').innerText = currentMove;
    setTimeout(function () {
      AI();
    }, 1000 / game.fps);
  };

  requestAnimationFrame(AI);
});