var defsSvgEl = document.querySelector('.defs defs');
var defCounter = 0;
var defs;
var sprites = [];
var duplicates = [spriteStars, spriteCluster, spriteWave];

/**
 * Break the image and def strings into their parts
 * @param {string} imagesString
 * @param {string} defsString
 */
function initializeRenderer(imagesString, defsString) {
  defs = defsString.split('|').map(def => {
    if (def.charAt(0) === '?') {
      def = def.split('?');
      def.shift();
      return def.map(defPart => defPart.split(','));
    } else {
      return '#' + def;
    }
  });
  let imageStrings = imagesString.split('_');
  imageStrings.forEach((imageString) => {
    createSprites(imageString, imageStrings);
  });
  sprites.map((sprite, index) => hideSprites(index));
}

/**
 * A very crude tweening for the SVGs, half the time it doesn't work.
 * @param {number} variantIndex
 * @param {number} spriteIndex
 * @param {number} duration
 */
function tweenToVariant(variantIndex, spriteIndex, duration) {
  let sprite = sprites[spriteIndex];
  if (sprite.variants[variantIndex] === undefined || variantIndex === sprite.v) return;
  sprite.v = variantIndex;
  let variantEls = sprite.variants[variantIndex].querySelectorAll('*');

  [...sprite.itemEls.querySelectorAll('*')].forEach((el, index) => {
    let startD = el.getAttribute('d');
    let endD = variantEls[index].getAttribute('d');
    let startTransform = el.getAttribute('transform');
    let endTransform = variantEls[index].getAttribute('transform');
    let startFill = el.getAttribute('fill');
    let endFill = variantEls[index].getAttribute('fill');

    if (startD !== null && endD !== null && startD !== '' && endD !== '' && startD !== endD) {
      let startValues = startD.match(/[-]?[\d.]+/g);
      let startLetters = startD.split(/[-]?[\d.]+/g);
      let endValues = endD.match(/[-]?[\d.]+/g);
      let endLetters = endD.split(/[-]?[\d.]+/g);

      if (startValues !== null) {
        createTicker(function(complete, duration) {
          let tweened = '';
          let tweenedValues = startValues.map((startValue, i) => {
            return interpolate(complete, duration, parseFloat(startValue), parseFloat(endValues[i]));
          });

          for (let i = 0; i < startLetters.length; i++) {
            tweened += (startLetters[i].length > endLetters[i].length ? startLetters[i] : endLetters[i]) + (tweenedValues[i] !== undefined ? tweenedValues[i] : '');
          }

          el.setAttribute('d', tweened);
        }, duration || 1);
      }
    }

    if (startTransform !== endTransform) {
      el.setAttribute('transform', endTransform);
    }

    if (startFill !== endFill) {
      el.setAttribute('fill', endFill);
    }
  });
}

/**
 * @param {array} spriteIndices
 */
function showSprites(spriteIndices) {
  spriteIndices = spriteIndices.map === undefined ? [spriteIndices] : spriteIndices;
  spriteIndices.map(spriteIndex => showEl(sprites[spriteIndex].itemEls));
}

/**
 * @param {array} spriteIndices
 */
function hideSprites(spriteIndices) {
  spriteIndices = spriteIndices.map === undefined ? [spriteIndices] : spriteIndices;
  spriteIndices.filter(spriteIndex => sprites[spriteIndex] !== undefined).map(spriteIndex => hideEl(sprites[spriteIndex].itemEls));
}

/**
 * Hide all the sprites on screen
 */
function hideViewScreenSprites() {
  for (let i = 6; i < sprites.length; i++) {
    hideSprites(i);
  }
}

/**
 * @param {number} spriteIndex
 * @param {number} x
 * @param {number} y
 */
function moveSprite(spriteIndex, x, y) {
  let sprite = sprites[spriteIndex];

  sprite.x = x ? x : sprite.x;
  sprite.y = y ? y : sprite.y;

  setTransform(sprite.itemEls, sprite.x, sprite.y, sprite.r);
}

/**
 * @param {string} imageString
 * @param {array} imageStrings
 */
function createSprites(imageString, imageStrings) {
  let prefix = getPrefix(imageString);

  if (prefix[0]) {
    var codesList = prefix[1];
    let svgEls = document.querySelectorAll('.' + prefix[0]);

    [...svgEls].forEach((svgEl) => {
      let itemEls = getSvgElsFromImageString(imageString, imageStrings, codesList[0]);
      let variants = (codesList.length === 0 ? [getSvgElsFromImageString(imageString, imageStrings, codesList[0])] : []).concat(codesList.map(codes => getSvgElsFromImageString(imageString, imageStrings, codes)));
      var currIndex = sprites.length;

      sprites.push({
        itemEls: itemEls,
        variants: variants,
        x: 0,
        y: 0,
        v: 0
      });
      svgEl.append(itemEls);
      duplicates.filter(duplicateIndex => duplicateIndex === currIndex).map(duplicateIndex => {
        var newItemEls = itemEls.cloneNode(true);
        sprites.push({
          itemEls: newItemEls,
          variants: variants,
          x: 0,
          y: 0,
          v: 0
        });
        svgEl.append(newItemEls);
      });

    });
  }
}

/**
 * @param {string} imageString
 */
function getPrefix(imageString) {
  let svgInnerStrings = imageString.split('|');
  let prefix = svgInnerStrings.shift();
  let svgClass = '';
  let variantCodes = [];

  if (prefix) {
    svgClass = prefix[0];
    if (prefix.length > 1) {
      variantCodes = prefix.slice(1).split('.').map(code => code.split(','));
    }
  }
  return [svgClass, variantCodes];
}

/**
 * @param {string} imageString
 * @param {array} imageStrings
 * @param {array} variantCodes
 */
function getSvgElsFromImageString(imageString, imageStrings, variantCodes = []) {
  let gEl = document.createElementNS('http://www.w3.org/2000/svg','g');
  let svgInnerStrings = imageString.split('|');
  svgInnerStrings.shift();

  svgInnerStrings.forEach((svgInnerString) => {
    let variantStrings = svgInnerString.split('#');
    let stringItems;
    let sourceItems;

    variantStrings.forEach((variantString, index) => {
      let variantItems = variantString.split(',');

      if (index === 0) {
        stringItems = variantItems;
        sourceItems = variantItems;
      } else if (variantCodes.indexOf(variantItems[0]) !== -1) {
        stringItems = variantItems;
        stringItems.shift();
      }
    });

    sourceItems.forEach((sourceItem, index) => {
      if (stringItems[index] === undefined || stringItems[index] === '') {
        stringItems[index] = sourceItem;
      }
    });
    if (stringItems[0] === '@') {
      let gChildEl = getSvgElsFromImageString(imageStrings[stringItems[1]], imageStrings, variantCodes);
      gEl.append(gChildEl);
      gChildEl.setAttribute('transform', `translate(${stringItems[2]} ${stringItems[3]}) ${stringItems[4] ? `scale(${stringItems[4]} ${stringItems[5] || stringItems[4]})` : ''}`);
    } else {
      let pathEl = document.createElementNS('http://www.w3.org/2000/svg','path');
      pathEl.setAttribute('d', stringItems[0]);
      gEl.append(pathEl);
      pathEl.setAttribute('fill', stringItems[1] ? getPaintVal(stringItems[1]) : 'none');
      pathEl.setAttribute('stroke', stringItems[2] ? getPaintVal(stringItems[2]) : 'none');
      pathEl.setAttribute('stroke-width', stringItems[3] || '');
      pathEl.setAttribute('opacity', stringItems[4] || '');
    }
  });

  return gEl;
}

/**
 * @param {string} p
 */
function getPaintVal(p) {
  let ps = p.split(' ');
  let d = defs[ps[0]];

  if (ps.length === 1) {
    return d;
  } else {
    let ge = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
    let id = defCounter++;
    ge.setAttribute('id', 'g' + id);
    ge.setAttribute('x1', ps[1]);
    ge.setAttribute('x2', ps[2]);
    ge.setAttribute('y1', ps[3]);
    ge.setAttribute('y2', ps[4]);
    ge.setAttribute('gradientUnits','userSpaceOnUse');
    d.forEach((s) => {
      let se = document.createElementNS('http://www.w3.org/2000/svg','stop');
      se.setAttribute('stop-color', defs[s[0]]);
      se.setAttribute('offset', s[1]);
      se.setAttribute('stop-opacity', s[2]);
      ge.append(se);
    });
    defsSvgEl.append(ge);
    return 'url(#g' + id + ')';
  }
}
