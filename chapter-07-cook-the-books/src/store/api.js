// Replace [JSONSTORE.IO ENDPOINT]' with your jsonstore.io endpoint below (no ending slash):
// Make sure you remove the "[" and "]" from the string.
const API_URL = '[JSONSTORE.IO ENDPOINT]';

// Example:
// const API_URL = 'https://www.jsonstore.io/ba365164c3806df04e7e6f22321adfe8897b6f17eaa4f9ce6e298f1d123';

/**
 * Wrapper for performing API calls. We don't want to call response.json()
 * each time we make a fetch call.
 * @param {string} endpoint Endpoint (e.g. "/transactions" to make API call to
 * @param {Object} init Fetch options object containing any custom settings
 * @returns {Promise<*>}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 */
const performApiFetch = (endpoint = '', init = {}) =>
  fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-type': 'application/json'
    },
    ...init
  }).then(response => response.json());

export const apiFetchTransactions = () =>
  performApiFetch('/transactions').then(({ result }) =>
    /*
     * The response object looks like this:
     * {
     *   "result": {
     *     "1": {
     *       "category": "Sales Revenue",
     *       ...
     *     },
     *     "2": {
     *       "category": "Hotels",
     *       ...
     *     },
     *     ...
     *   }
     * }
     * We need the "1" and "2" values for deleting or editing existing
     * records, so we store that in the transaction record as "apiId".
     */
    Object.keys(result).map(apiId => ({
      ...result[apiId],
      apiId
    }))
  );

export const apiEditTransaction = transaction =>
  performApiFetch(`/transactions/${transaction.apiId}`, {
    method: 'POST',
    body: JSON.stringify(transaction)
  });

export const apiRemoveTransaction = transaction =>
  performApiFetch(`/transactions/${transaction.apiId}`, {
    method: 'DELETE'
  });

export const apiAddTransaction = transaction =>
  performApiFetch(`/transactions/${transaction.apiId}`, {
    method: 'POST',
    body: JSON.stringify(transaction)
  });
