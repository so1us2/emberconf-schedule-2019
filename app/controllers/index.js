import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import ENV from 'emberconf/config/environment';
import moment from 'emberconf/libs/moment';

export default Controller.extend({
  fastboot: service(),

  now: null,

  days: alias('model'),

  _setNow() {
    if (ENV.APP.shouldForceDayOne) {
      // Use conf Day 1 for development
      let time = moment().utcOffset(ENV.APP.UTC_OFFSET).format('HH:mm:ss');
      this.set('now', moment(`2019-03-19T${time}${ENV.APP.UTC_OFFSET}`).format());
    } else {
      // Use real date and time for non-dev environments
      this.set('now', moment().utcOffset(ENV.APP.UTC_OFFSET).format());
    }

    if (!ENV.APP.shouldUpdateTime || this.get('fastboot.isFastBoot')) { return; }

    later(this, function() {
      this._setNow();
    }, 10000);
  },

  init() {
    this._super(...arguments);
    // Commented out post-conference
    this._setNow();
  }
});
