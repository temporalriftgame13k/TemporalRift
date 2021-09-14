var dialogBoxEls = getElsBySelector('.text');
var portraitEls = getElsBySelector('.portrait');
var lastVariantIndices = [];
var lastSpriteIndices = [-1, -1];

/**
 * Show the dialog for the current step.
 * @param {number} stepIndex
 */
function showDialog(stepIndex, callback) {
  showDialogComponents(...[callback].concat((steps[stepIndex].split('|')).map(dialogPart => dialogPart || undefined)));
}

/**
 * Show both the text and portraits of speakers.
 * @param {function} callback
 * @param {number} dialogBoxElIndex
 * @param {string} text
 * @param {number} variantIndex0
 * @param {number} variantIndex1
 * @param {number} spriteIndex0
 * @param {number} spriteIndex1
 */
function showDialogComponents(
  callback,
  dialogBoxElIndex,
  text,
  variantIndex0 = lastVariantIndices[0],
  variantIndex1 = lastVariantIndices[1],
  spriteIndex0 = lastSpriteIndices[0],
  spriteIndex1 = lastSpriteIndices[1]
) {
  let delay = lastSpriteIndices[dialogBoxElIndex] === -1 ? 1 : 0;
  showText(dialogBoxElIndex, text, delay, callback);
  showPortrait(0, variantIndex0, spriteIndex0);
  showPortrait(1, variantIndex1, spriteIndex1);
}

/**
 * Show portrait
 * @param {number} portraitElIndex
 * @param {number} variantIndex
 * @param {number} spriteIndex
 */
function showPortrait(portraitElIndex, variantIndex, spriteIndex) {
  let portraitEl = portraitEls[portraitElIndex];
  let lastSpriteIndex = lastSpriteIndices[portraitElIndex];
  variantIndex = parseInt(variantIndex);
  spriteIndex = parseInt(spriteIndex);

  if (spriteIndex !== lastSpriteIndex && spriteIndex !== undefined) {
    hideEl(portraitEl);
    hideSprites(lastSpriteIndex);
  }

  if (spriteIndex !== -1) {
    setTimeoutWrapper(() => {
      let tweenDuration = spriteIndex !== lastSpriteIndex ? 0 : .4;
      tweenToVariant(variantIndex, spriteIndex, tweenDuration);
      showEl(portraitEl);
      showSprites(spriteIndex);
    }, lastSpriteIndex === -1 ? 0 : .3);
  }

  lastVariantIndices[portraitElIndex] = variantIndex;
  lastSpriteIndices[portraitElIndex] = spriteIndex;
}

/**
 * Show text
 * @param {number} dialogBoxElIndex
 * @param {string} text
 * @param {number} delay
 */
function showText(dialogBoxElIndex, text = '', delay = 0, callback = () => {}) {
  let dialogBoxEl = dialogBoxEls[dialogBoxElIndex];

  dialogBoxEls.map((dialogBoxEl, index) => {
    if (dialogBoxElIndex !== index || text === '') {
      hideEl(dialogBoxEl);
    }
  });

  if (text !== '') {
    setInnerHtml(dialogBoxEl, text.split('').map(char => `<span>${char}</span>`).join(''));

    setTimeoutWrapper(() => {
      getElsBySelector('span', dialogBoxEl).map((spanEl, index) => {
        setTimeoutWrapper(() => {setOpacity(spanEl, 1)}, index / 100 + .2);
        setTimeoutWrapper(callback, Math.max(text.length / 100 + .4, 1));
      });

      showEl(dialogBoxEl);
    }, delay);
  }
}

/**
 * Hide dialog
 */
function hideDialog() {
  showPortrait(0, -1, -1);
  showPortrait(1, -1, -1);
  showText(0, '');
  showText(1, '');
  showText(2, '');
}
