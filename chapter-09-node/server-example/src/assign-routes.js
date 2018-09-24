const express = require('express');
const Transaction = require('./Transaction');

/**
 * This function sets up the various routes used to perform actions on
 * transactions.
 */
module.exports = function assignRoutes(app, assets) {
  const { db, wasmInstance } = assets;
  const transaction = new Transaction(db, wasmInstance);

  // We're creating a Router instance instead of using app.get(),
  // app.set(), etc. so we don't have to prefix all of the routes with
  // "/transactions":
  const transactionsRouter = express.Router();
  transactionsRouter
    .route('/')
    // Return an array of all transactions:
    .get((req, res) => {
      const transactions = transaction.findAll();
      res.status(200).send(transactions);
    })
    // Add a new transaction and return the resulting transaction record:
    .post((req, res) => {
      const { body } = req;
      if (!body) {
        return res.status(400).send('Body of request is empty');
      }
      const newRecord = transaction.add(body);
      res.status(200).send(newRecord);
    });

  transactionsRouter
    // Return the sum of all transactions:
    .get('/grandTotal', (req, res) => {
      const total = transaction.getGrandTotal();
      res.status(200).send({ total });
    })
    // Returns the transaction totals broken down by each category. If
    // ?id=[Category ID] is specified in the URL, only return the total
    // for that category:
    .get('/categoryTotals', (req, res) => {
      const { id = null } = req.query;
      const totals =
        id === null
          ? transaction.getTotalsForAllCategories()
          : transaction.getTotalForCategory(+id);
      res.status(200).send(totals);
    });

  transactionsRouter
    .route('/:id')
    // Returns a single transaction matching the ID specified as a param,
    // so /transactions/1000 will return the corresponding transaction:
    .get((req, res) => {
      const foundTransaction = transaction.findById(+req.params.id);
      if (!foundTransaction) {
        return res.status(400).send('Transaction not found');
      }
      res.status(200).send(foundTransaction);
    })
    // Deletes the transaction with the specified ID and returns 200 if
    // successful:
    .delete((req, res) => {
      try {
        transaction.remove(+req.params.id);
        res.sendStatus(200);
      } catch (err) {
        return res.status(400).send(err.message);
      }
    })
    // Updates any field values for the transaction matching the ID
    // specified as a param. Since this is a PATCH, only fields that
    // changed can be included in the body of the request:
    .patch((req, res) => {
      const { body } = req;
      if (!body) {
        return res.status(400).send('Body of request is empty');
      }
      const updatedTransaction = transaction.edit(+req.params.id, body);
      res.status(200).send(updatedTransaction);
    });

  // Set the base path for all routes on transactionsRouter:
  app.use('/api/transactions', transactionsRouter);

  // Route to ensure a GET request to the base path returns a 200:
  app.get((req, res) => res.sendStatus(200));
};
