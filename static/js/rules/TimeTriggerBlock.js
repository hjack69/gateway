const RulePartBlock = require('./RulePartBlock');
var cron = require('node-cron');

/**
 * An element representing a time-based trigger
 *
 * @constructor
 * @param {Element} ruleArea
 * @param {Function} onPresentationChange
 * @param {Function} onRuleChange
 */
function TimeTriggerBlock(ruleArea, onPresentationChange, onRuleUpdate) {
  RulePartBlock.call(this, ruleArea, onPresentationChange, onRuleUpdate,
                     'Time of Day', '/optimized-images/rule-icons/clock.svg');

  const rulePartInfo = this.elt.querySelector('.rule-part-info');

  this.cronInput = document.createElement('input');
  this.cronInput.type = 'text';
  this.cronInput.classList.add('time-input');
  // Disable dragging started by clicking interval input
  this.cronInput.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
  this.cronInput.addEventListener('touchstart', (e) => {
    e.stopPropagation();
  });
  // Set data on change
  this.cronInput.addEventListener('change', () => {
    this.rulePart = {trigger: {
      type: 'TimeTrigger',
      schedule: TimeTriggerBlock.verifyCronTime(this.cronInput.value),
    }};
    this.onRuleChange();
  });
  rulePartInfo.appendChild(this.cronInput);
}

TimeTriggerBlock.prototype = Object.create(RulePartBlock.prototype);

/**
 * Initialize based on an existing partial rule
 */
TimeTriggerBlock.prototype.setRulePart = function(rulePart) {
  this.rulePart = rulePart;

  if (rulePart.trigger) {
    this.role = 'trigger';
    this.rulePartBlock.classList.add('trigger');

    this.cronInput.value = "* * * * * *";
  }

  if (rulePart.effect) {
    throw new Error('TimeTriggerBlock can only be a trigger');
  }
};

TimeTriggerBlock.prototype.onUp = function(clientX, clientY) {
  RulePartBlock.prototype.onUp.call(this, clientX, clientY);
  if (this.role === 'effect') {
    this.remove();
  }
  if (this.role === 'trigger') {
    this.rulePart = {trigger: {
      type: 'TimeTrigger',
      schedule: TimeTriggerBlock.verifyCronTime(this.cronInput.value),
    }};
    this.onRuleChange();
  }
};

TimeTriggerBlock.leftPad = function(n) {
  return n.toString().padStart(2, '0');
};

/**
 * Convert from a utc time string to one in the local timezone
 * @param {String} utcTime - formatted HH:MM
 * @return {String}
 */
// TimeTriggerBlock.utcToLocal = function(utcTime) {
//   const timeParts = utcTime.split(':');
//   const date = new Date();
//   date.setUTCHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
//   const lp = TimeTriggerBlock.leftPad;
//   return `${lp(date.getHours())}:${lp(date.getMinutes())}`;
// };

/**
 * Convert from a local time string to one in UTC
 * @param {String} localTime - formatted HH:MM
 * @return {String}
 */
// TimeTriggerBlock.localToUTC = function(localTime) {
//   const timeParts = localTime.split(':');
//   const date = new Date();
//   date.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
//   const lp = TimeTriggerBlock.leftPad;
//   return `${lp(date.getUTCHours())}:${lp(date.getUTCMinutes())}`;
// };

/**
 *
 */
TimeTriggerBlock.verifyCronTime = function(cronTime) {
  //TODO: Change text to red if !cron.validate(cronTime)
  return cronTime
};

module.exports = TimeTriggerBlock;
