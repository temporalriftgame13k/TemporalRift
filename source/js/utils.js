/**
 * Utils
 *
 * I make these wrapper functions so I can call the minified function names
 * instead of the long property, e.g. document.querySelectorAll.
 */

/**
 * @param {string} selector
 * @param {element} parentEl
 * @returns {array}
 */
function getElsBySelector(selector, parentEl) {
  return [...((parentEl || document)['querySelectorAll'](selector))];
}

/**
 * @param {element} el
 * @param {string} html
 */
function setInnerHtml(el, html) {
  el.innerHTML = html;
}

/**
 * @param {element} el
 * @param {number} opacity
 */
function setOpacity(el, opacity) {
  el.style.opacity = opacity;
}

/**
 * @param {element} el
 */
function showEl(el) {
  setOpacity(el, 1);
  el.style.pointerEvents = '';

  if (el.nodeName === 'BUTTON') {
    setAttribute(el, 'tabindex', '');
  }
}

/**
 * @param {element} el
 */
function hideEl(el) {
  setOpacity(el, 0);
  el.style.pointerEvents = 'none';

  if (el.nodeName === 'BUTTON') {
    setAttribute(el, 'tabindex', '-1');
  }
}

/**
 * @param {element} el
 * @param {number} x
 * @param {number} y
 * @param {number} r
 * @param {string} units
 */
function setTransform(el, x, y, r, units = '%') {
  el.style.transform = getTransformValue(x, y, r, units);
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} r
 * @param {string} units
 * @param {string} rotateUnits
 */
function getTransformValue(x, y, r, units = '%', rotateUnits = 'deg') {
  return `translate(${x || 0}${units}, ${y || 0}${units})${!isNaN(r) ? ` rotate(${r}${rotateUnits})` : ''}`;
}

/**
 * @param {element} el
 * @param {string} attributeName
 * @param {string} value
 */
function setAttribute(el, attributeName, value) {
  el.setAttribute(attributeName, value);
}

/**
 * @param {function} callback
 * @param {number} duration
 */
function setTimeoutWrapper(callback, duration = 0) {
  setTimeout(callback, duration * 1000);
}

/**
 * @param {number} complete
 * @param {number} duration
 * @param {number} start
 * @param {number} end
 * @param {number} repeat
 * @returns {number}
 */
function interpolate(complete, duration, start, end, repeat) {
  if (complete > duration) {
    if (repeat) {
      complete = complete % duration;
    } else {
      complete = duration;
    }
  }

  let ratio = complete / duration;
  return parseFloat((start * (1 - ratio) + end * ratio).toFixed(3));
}
