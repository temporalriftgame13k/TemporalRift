var raf = requestAnimationFrame;
var currentTimeStamp;
var tickers = [];
var tickerCounter = 0;

/**
 * Called every frame.
 * @param {number} timeStamp
 */
function tick(timeStamp) {
  tickers.forEach(ticker => { tickTicker(ticker, timeStamp / 1000) });
  currentTimeStamp = timeStamp / 1000;
  raf(tick);
}

/**
 * Adds a ticker object to tickers array which is called every frame.
 * @param {function} callback
 * @param {number} duration
 * @param {boolean} repeat
 */
function createTicker(callback, duration, repeat) {
  tickers.push({
    id: tickerCounter,
    s: currentTimeStamp,
    d: duration,
    cb: callback,
    r: repeat
  });

  return tickerCounter++;
}

/**
 * Deletes a ticker by id.
 * @param {number} id
 */
function removeTicker(id) {
  let tickerToRemoveIndex = tickers.indexOf(tickers.filter(ticker => ticker.id === id)[0]);
  tickers.splice(tickerToRemoveIndex, 1);
}

/**
 * Removes all tickers.
 */
function removeAllTickers() {
  tickers = [];
}

/**
 * Calls the callback function of a ticker object.
 * @param {object} ticker
 * @param {number} timeStamp
 */
function tickTicker(ticker, timeStamp) {
  let complete = timeStamp - ticker.s;

  if (timeStamp - ticker.s >= ticker.d) {
    if (ticker.r) {
      ticker.s += ticker.d;
    } else {
      removeTicker(ticker.id);
      complete = ticker.d;
    }
  }

  ticker.cb(complete, ticker.d);
}
