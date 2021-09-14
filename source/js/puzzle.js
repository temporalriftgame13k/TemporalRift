var puzzleArray = [];
var asteroidArray = [0,,,0,,0,,2,0,0,0,0,0,,0,,,0,0,0,,0,0,,0,,0,,,,0,,1,,0,0,0,0,0,0];
var pipeArray = [,5,5,,3,2,,,5,5,5,3,3,5,3,,5,3,5,3,3,3,3,,,4,5,3,4,3,5,3,,5,,,3,,1,];
var pipeAnswerArray = [,1,2,,,,,,1,3,0,4,4,3,,,0,4,2,,,,,,,,0,4,,4,2];
var mapArray = [,,6,,,,,,,,,0,6,,0,,,6,,,,,,,,,0,6,,6,,,,,,,,,0,];
var puzzleMode = -1;
var asteroidsSelected = [];

/**
 * Create interface for most commonly used puzzles.
 */
function initializePuzzle() {
  let puzzleEl = sprites[spritePuzzle].itemEls;
  let firstPuzzlePieceEl = puzzleEl.lastChild;
  moveSprite(spritePuzzle, 12.75, 36.6);
  moveSprite(spriteCells, 12.75, 18);

  for (let i = 0; i < 8; i++) {
    if (puzzleArray[i] === undefined) {
      puzzleArray[i] = [];
    }

    for (let j = 0; j < 5; j++) {
      let pieceEl;

      if (i === 0 && j === 0) {
        pieceEl = firstPuzzlePieceEl;
      } else {
        pieceEl = firstPuzzlePieceEl.cloneNode(true);
        puzzleEl.append(pieceEl);
      }

      setAttribute(pieceEl, 'transform', getTransformValue(i * 100 + 10, j * 100 + 10, 0, '', ''));
      hideEl(pieceEl);
      puzzleArray[i][j] = {n: pieceEl, s: -1, a: 0, i: i, j: j};

      (function (i, j) {
        pieceEl.addEventListener('click', () => {
          if (!lockInterface) {
            let piece = puzzleArray[i][j];

            if (puzzleMode === 1) {
              asteroidClick(piece, i, j);
            } else if (puzzleMode === 2) {
              pipeClick(piece, i, j);
            } else if (puzzleMode === 3) {
              mapClick(piece, i, j);
            }
          }
        });
      })(i, j);
    }
  }
}

/**
 * Shows a general puzzle
 */
function showPuzzle(inputArray) {
  showSprites(spritePuzzle);

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 5; j++) {
      let s = inputArray[j * 8 + i];
      showEl(puzzleArray[i][j].n);
      setPieceState(puzzleArray[i][j], 0, s === undefined ? -1 : s);
    }
  }

  lockInterface = false;
}

/**
 * Shows the asteroids puzzle
 */
function showAsteroidPuzzle() {
  puzzleMode = 1;
  asteroidsSelected = [];
  showPuzzle(asteroidArray);
}

/**
 * Shows the pipe puzzle
 */
function showPipePuzzle() {
  puzzleMode = 2;
  showPuzzle(pipeArray);
}

/**
 * Shows the map puzzle
 */
function showMapPuzzle() {
  puzzleMode = 3;
  showPuzzle(mapArray);
}

/**
 * Hides the puzzle
 */
function hidePuzzle() {
  hideSprites(spritePuzzle);
  puzzleMode = -1;
}

/**
 * @param {object} piece
 * @param {number} a
 * @param {number} s
 */
function setPieceState(piece, a = piece.a, s = piece.s) {
  let iconEls = [...piece.n.children];
  iconEls.shift();
  piece.a = a;
  piece.s = s;

  setOpacity(piece.n, 1);

  if (puzzleMode === 1) {
    setOpacity(piece.n, a ? .3 : 1);
  }

  iconEls.map((iconEl, index) => {
    if (index === s) {
      showEl(iconEl);
      if (puzzleMode === 2) {
        iconEl.style.transformOrigin = '4.56% 5.54%';
        setTransform(iconEl, 0, 0, 90 * piece.a);
      }
    } else {
      hideEl(iconEl);
    }
  });
}

/**
 * @param {number} i
 * @param {number} j
 */
function asteroidClick(piece, i, j) {
  let answer1Found = false;
  let answer2Found = false;

  if (piece.s !== 0) {
    return;
  }

  if (piece.a === 1) {
    setPieceState(piece, 0);
    asteroidsSelected.splice(asteroidsSelected.indexOf(piece), 1);
  } else {
    setPieceState(piece, 1);

    if (asteroidsSelected.length >= 2) {
      setPieceState(asteroidsSelected[0], 0);
      asteroidsSelected.shift();
    }

    asteroidsSelected.push(piece);
  }

  asteroidsSelected.map((piece) => {
    if (piece.j === 3) {
      if (piece.i === 2) {
        answer1Found = true;
      }

      if (piece.i === 6) {
        answer2Found = true;
      }
    }
  });

  if (answer1Found && answer2Found) {
    lockInterface = true;
    showCorrect();

    setTimeoutWrapper(() => {
      hidePuzzle();
      progress();
    }, .5);
  }
}

/**
 * @param {number} i
 * @param {number} j
 */
function pipeClick(piece, i, j) {
  let wrongPiece = false;
  setPieceState(piece, (piece.a + 1) % 4);

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 5; j++) {
      let piece = puzzleArray[i][j];
      let answer = pipeAnswerArray[j * 8 + i];

      if (answer !== piece.a && answer !== undefined) {
        if (piece.s !== 3 || (piece.a === 1 || piece.a === 3)) {
          wrongPiece = true;
        }
      }
    }
  }

  if (wrongPiece === false) {
    lockInterface = true;
    showCorrect();

    setTimeoutWrapper(() => {
      hidePuzzle();
      progress();
    }, .5);
  }
}

/**
 * @param {number} i
 * @param {number} j
 */
function mapClick(piece, i, j) {
  lockInterface = true;

  if (i === 0 && j === 3) {
    showCorrect();
  } else {
    showIncorrect();
  }

  setTimeoutWrapper(() => {
    hidePuzzle();
    progress();
  }, .5);
}
