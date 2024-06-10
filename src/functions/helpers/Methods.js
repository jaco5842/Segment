const axios = require('axios');
const { time } = require('console');
const { env } = require('process');
const { Analytics } = require('@segment/analytics-node');
const moment = require('moment');



async function apikey(company) {
    let apiKey;
    switch (company) {
        case "Excellent Wine":
            apiKey = process.env.apikeyEW;
            break;
        case "Philipson Wine":
            apiKey = process.env.apikeyPW;
            break;
        case "Test":
            apiKey = process.env.apikeyTEST;
            break;
        default:
            throw new Error("Invalid company");
    }
    
    // Encode the apiKey using base64
    const encodedApiKey = Buffer.from(apiKey).toString('base64');
    
    // Define the headers
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedApiKey}`
    };
    
    return { headers, apiKey };
}

async function track(context, company, event, userId, anonymousId, messageId, timestamp, properties) {
    try {
        const apikeyResponse = await apikey(company);
        const headers = apikeyResponse.headers;

        let payload = {
            userId: userId,
            anonymousId: anonymousId,
            event: event,
            messageId: messageId,
            timestamp: timestamp || new Date().toISOString(), // Fallback to current time if timestamp is not provided
            properties: properties
        };

        // Await the axios POST request and return its promise
        const response = await axios.post(process.env.segmenttrackurl, payload, { headers });
        context.log('Track request successful:', response.data);
        context.log('Debug info url: ', process.env.segmenttrackurl , 'Headers', JSON.stringify(headers), 'Payload: ', JSON.stringify(payload));
    } catch (error) {
        context.error('Error sending Track request:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

async function identify(context, company, userId, anonymousId, traits) {
    const apikeyResponse = await apikey(company);
    const apiKey = apikeyResponse.apiKey;

    let formattedCreated = traits.subscriptionCreatedDate ? moment(traits.subscriptionCreatedDate).format('YYYY-MM-DDTHH:mm:ss') : null;
    let formattedTermination = traits.subscriptionTerminationDate ? moment(traits.subscriptionTerminationDate).format('YYYY-MM-DDTHH:mm:ss') : null;

    let payload = {
        bcid: traits.bcid,
        subscriptionName: traits.subscriptionName,
        subscriptionStatus: traits.subscriptionStatus,
        subscriptionCreatedDate: formattedCreated,
        email: traits.email,
        ...(traits.subscriptionStatus === 'unsubscribed' && { subscriptionTerminationDate: formattedTermination })
    };

    context.log(payload);

    const analytics = new Analytics({
        writeKey: apiKey,
        host: process.env.segmentidentifyurl,
    });

    // Wrap the analytics.identify call in a promise to await it
    await new Promise((resolve, reject) => {
        analytics.identify({
            userId: userId,
            anonymousId: anonymousId,
            traits: payload
        }, (err, res) => {
            if (err) {
                context.error("Error sending Identify request: ", err);
                reject(err);
            } else {
                context.log('Identify request successful:', res);
                resolve(res);
            }
        });
    });
}

async function postUrl(context, row, url) {
    try {

        let payload = {
            email: row.email
        };

        // Await the axios POST request and return its promise
        const response = await axios.post(url, payload);
        context.log('Track request successful:', response.data);
    } catch (error) {
        context.error('Error sending Track request:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

module.exports = { track, identify, postUrl };