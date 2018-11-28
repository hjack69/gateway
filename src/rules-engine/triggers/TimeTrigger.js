/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const Events = require('../Events');
const Trigger = require('./Trigger');
var cron = require('node-cron');

/**
 * An abstract class for triggers whose input is a single property
 */
class TimeTrigger extends Trigger {
  constructor(desc) {
    super(desc);
    this.schedule = desc.schedule;

    this.sendOn = this.sendOn.bind(this);
    this.sendOff = this.sendOff.bind(this);
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {schedule: this.schedule}
    );
  }

  async start() {
    this.scheduleNext();
  }

  scheduleNext() {
    console.log(`Validated input: ${cron.validate(this.schedule)}`);
    if (cron.validate(this.schedule)) {
      this.job = cron.schedule(this.schedule, this.sendOn);
      console.log(`Job status: ${this.job.status}`);
    }
  }

  sendOn() {
    this.emit(Events.STATE_CHANGED, {on: true, value: Date.now()});
    this.timeout = setTimeout(this.sendOff, 1000);     // 1 second resolution
  }

  sendOff() {
    this.emit(Events.STATE_CHANGED, {on: false, value: Date.now()});
    //this.scheduleNext();  // Should not need this...
  }

  stop() {
    if (this.job != null){
      this.job.stop();
    }
    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }
    this.timeout = null;
    this.job = null;
  }
}

module.exports = TimeTrigger;
