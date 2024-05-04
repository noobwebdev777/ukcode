const axios = require('axios')

class HttpUtils {
    async postWithWwwFormUrlencoded(url, body, headers) {
        const data = Object.keys(body)
            .map((key) => `${key}=${encodeURIComponent(body[key])}`)
            .join('&')
        const options = {
            method: 'POST',
            headers: {
                ...headers,
                'content-type': 'application/x-www-form-urlencoded',
            },
            data,
            url,
        }
        return (await axios(options)).data
    }
}

module.exports = new HttpUtils()
