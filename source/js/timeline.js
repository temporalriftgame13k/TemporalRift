/**
 * Array of times and functions to execute.
 * @param {array} timeline
 */
function executeTimeline(timeline) {
  let offsetTime = 0;

  timeline.map(timelineEvent => {
    if (!isNaN(timelineEvent)) {
      offsetTime += timelineEvent;
    } else {
      setTimeoutWrapper(timelineEvent, offsetTime);
    }
  });
}
