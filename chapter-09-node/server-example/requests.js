const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000;

const performFetch = (endpoint, options = {}) =>
  fetch(`http://localhost:${PORT}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());

/**
 * Returns an object with the endpoint and options to use for a fetch
 * call based on the actionId specified as an arg in the node command.
 * Actions without an "options" value are GET requests.
 */
const getFetchActionForId = (actionId, paramOrQuery = null) => ({
  '1': {
    endpoint: '/transactions',
  },
  '2': {
    endpoint: '/transactions',
    options: {
      method: 'POST',
      body: {
        transactionDate: '2018-07-01',
        toFrom: 'Mr. Test',
        type: 'Withdrawal',
        categoryId: 2,
        amount: -5000,
        description: 'Testing the application!',
      },
    },
  },
  '3': {
    endpoint: '/transactions/grandTotal',
  },
  '4': {
    endpoint: '/transactions/categoryTotals',
  },
  '5': {
    endpoint: `/transactions/categoryTotals?id=${paramOrQuery || 1}`,
  },
  '6': {
    endpoint: `/transactions/${paramOrQuery || 1000}`,
  },
  '7': {
    endpoint: `/transactions/${paramOrQuery || 1000}`,
    options: {
      method: 'DELETE',
    },
  },
  '8': {
    endpoint: `/transactions/${paramOrQuery || 1090}`,
    options: {
      method: 'PATCH',
      body: {
        toFrom: 'Mr. Test',
        categoryId: 2,
        description: 'Testing the patch!',
      },
    },
  },
}[actionId]);

const peformSpecifiedFetchAction = () => {
  // Arg passed into node command, if you run node ./requests.js 1,
  // the fetchAction with ID = 1 is called, which is a GET call to
  // the `/transactions` endpoint.
  const actionId = process.argv[2];

  // There are 8 actions total, so the final arg must be between 1 and 8:
  if (!actionId || +actionId < 1 || +actionId > 8) {
    console.error('You must specify an action number between 1 and 8');
    console.error('Example: node ./requests.js 1');
    return;
  }

  const paramOrQuery = process.argv[3];
  const fetchAction = getFetchActionForId(actionId, paramOrQuery);
  performFetch(fetchAction.endpoint, fetchAction.options)
    .then(response => {
      const printedResponse = JSON.stringify(response, null, 2);
      console.log(`Success\n${printedResponse}`);
    })
    .catch(err => {
      console.error(`Error: ${err}`);
      console.error('The app may not be running, run `npm start` to fix');
    });
};

peformSpecifiedFetchAction();
