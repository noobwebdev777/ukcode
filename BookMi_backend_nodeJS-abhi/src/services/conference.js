
const config = require("../config/config");
const axios = require('axios');
const query = require('querystring');

let conference = new Object()
let apiKey = '1a743f4a5678007420d368ce2c816f4e';
let url = 'https://api.mywebinar.com'

conference.createNewConference = async (input) => {
    const data = query.stringify({
        request: JSON.stringify({
            key: apiKey,
            action: 'webinarsCreate',
            params: {
                "name": input.className, 
                "start": new Date(Date.now() + ( 3600 * 1000 * 24)).toISOString().replace('T', ' ').substring(0, 19),
                "duration": "90"
            }
        })
    });
    let createMeeting = await conference.makeRequest(data)
    if (!createMeeting.status) {
        return { status: false, message: 'Failed to create Zoom Meeting', data: createMeeting.data }
    }
    return { status: true, message: 'Zoom Meeting Created', data: createMeeting.data }
}


conference.makeRequest = async (input) => {
    try {
        let req = await axios.post(url, input)
        if (req.data.response.error) {
            return { status: false, message: 'Failed to create conference', data: data.data }
        }
        return { status: true, message: 'conference Created', data: req.data }
    } catch (error) {

        return { status: false, message: 'Failed to create Zoom Meeting', error: error.response.data }
    }

}

module.exports = conference