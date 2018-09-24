/**
 * This file sends an HTTPS request to jsonstore.io to get a token, posts the
 * transactions data to the endpoint, and prints the token to the console
 * for pasting into the /src/store/api.js file.
 */
const https = require('https');
const transactionsData = require('./data.json');

const defaultRequestOptions = {
  host: 'www.jsonstore.io',
  port: 443,
  headers: {
    'Content-Type': 'application/json'
  }
};

const requestTokenFromJsonStore = () =>
  new Promise((resolve, reject) => {
    const options = {
      ...defaultRequestOptions,
      path: '/get-token',
      method: 'GET'
    };

    const getRequest = https.request(options, res => {
      res.on('data', data => {
        const result = JSON.parse(data);
        if (result.token) return resolve(result.token);
        return reject(new Error('Error getting token'));
      });
    });

    getRequest.end();

    getRequest.on('error', err => {
      return reject(err);
    });
  });

const uploadDataToJsonStore = token =>
  new Promise((resolve, reject) => {
    const options = {
      ...defaultRequestOptions,
      path: `/${token}/transactions`,
      method: 'POST'
    };

    const postRequest = https.request(options);

    postRequest.on('error', err => {
      return reject(err);
    });

    const requestData = JSON.stringify(transactionsData);
    postRequest.write(requestData);

    postRequest.end();

    return resolve();
  });

const setupApi = async () => {
  const token = await requestTokenFromJsonStore();
  await uploadDataToJsonStore(token);
  console.log('Data successfully updated, copy and paste the endpoint below into the /src/store/api.js file.');
  console.log(`https://www.jsonstore.io/${token}`);
};

setupApi();
