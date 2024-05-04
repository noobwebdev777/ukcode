const Mixpanel = require('mixpanel');
const _ = require("lodash");

const mixpanel = Mixpanel.init('c68c38734f1d645d8cf14577209bd799');

const bookmifyKeys = (payload) => {
	const res = {};
	Object.keys(payload).map(k => {
		res[`bkmi_${k}`] = payload[k]
	})
	return res
}

const track = (eventName, payload) => {
    if (_.isEmpty(eventName) || _.isEmpty(payload)) {
        return;
    }
    mixpanel.track(eventName, bookmifyKeys(payload));
}

module.exports = {
    track
};
