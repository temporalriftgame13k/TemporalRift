var optionEls;
var buttonContainerEl = getElsBySelector('.buttons-container')[0];
var correctEl = getElsBySelector('.correct')[0];
var incorrectEl = getElsBySelector('.incorrect')[0];
var buttonEls;
var correctAnswerIndex;

/**
 * Add buttons to DOM and bind events.
 */
function initializeInterface() {
  setInnerHtml(buttonContainerEl, [0,1,2].map((nothing, index) => {
    return `<button class="button button${index} border shadow"></button>`;
  }).join(''));

  setTimeoutWrapper(() => {
    buttonEls = getElsBySelector('.button', buttonContainerEl);
    buttonEls.map(function(el, index) {
      el.addEventListener('click', () => {
        buttonClick(index);
      });
    });

    sprites[spriteOptions].itemEls.classList.add('options');
    optionEls = getElsBySelector('path', sprites[spriteOptions].itemEls);
    setOptions();
    moveSprite(spriteOptions, 27, 50);
    showSprites([spriteBg, spriteBg1, spriteOptions]);
  });
}

/**
 * Accepts an array showing option labels.
 */
function setOptions(optionLabels = ['', '', ''], answerIndex) {
  let hasOption = false;
  correctAnswerIndex = answerIndex;

  optionLabels.map((label, index) => {
    if (!!label) {
      showEl(optionEls[index]);
      showEl(buttonEls[index]);
      hasOption = true;
    } else {
      hideEl(optionEls[index]);
      hideEl(buttonEls[index]);
    }

    if (label) {
      setInnerHtml(buttonEls[index], label);
    }
  });

  lockInterface = !hasOption;
}

/**
 * Do something on button click depending on index and step.
 */
function buttonClick(index) {
  if (!lockInterface) {
    let delay = 0;
    lockInterface = true;

    if (index === correctAnswerIndex) {
      showCorrect();
      delay = 1;
    } else if (correctAnswerIndex !== undefined) {
      showIncorrect();
      delay = 1;
    }

    setOptions();


    if (index === 0 && stepIndex == 58) {
      stepIndex = 0;
    }

    setTimeoutWrapper(progress, delay);
  }
}

/**
 * Show default continue
 */
function showContinue() {
  setOptions(['', 'CONTINUE', '']);
}

/**
 * Show correct message
 */
function showCorrect() {
  showEl(correctEl);
  setTimeoutWrapper(() => {
    hideEl(correctEl)
  }, 1.4);
}

/**
 * Show correct message
 */
function showIncorrect() {
  showEl(incorrectEl);
  setTimeoutWrapper(() => {
    hideEl(incorrectEl)
  }, 1.4);
}
