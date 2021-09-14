var stepIndex = 0;
var lockInterface = true;

/**
 * Initialize other parts of the game and progress to the first step.
 */
function initialize() {
  initializeRenderer(imagesString, defsString);
  initializePuzzle();
  initializeInterface();
  raf(tick);
  progress();
}

/**
 * Go to the next step.
 */
function progress() {
  showStep(stepIndex++);
}

initialize();
