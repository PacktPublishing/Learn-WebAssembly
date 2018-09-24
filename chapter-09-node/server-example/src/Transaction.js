/**
 * Class used to perform Transaction operations in the local "database"
 * and Wasm instance.
 * @class
 */
class Transaction {
  /**
   * A new Transaction instance is only created once, when the routes are
   * assigned. We can populate the Wasm linked list in the constructor
   * because any existing instance is destroyed when the app exits.
   */
  constructor(db, wasmInstance) {
    this.db = db;
    this.wasmInstance = wasmInstance;
    this.populateInWasm();
  }

  /**
   * Ensures the amount has the proper sign (withdrawals are negative and
   * deposits are positive).
   */
  getValidAmount(transaction) {
    const { amount, type } = transaction;
    return type === 'Withdrawal' ? -Math.abs(amount) : amount;
  }

  /**
   * Adds the specified transaction to the linked list in the Wasm module.
   */
  addToWasm(transaction) {
    const { id, categoryId } = transaction;
    const amount = this.getValidAmount(transaction);
    this.wasmInstance._addTransaction(id, categoryId, amount);
  }

  get categories() {
    return this.db.get('categories');
  }

  get transactions() {
    return this.db.get('transactions');
  }

  /**
   * Add the specified transaction to db.json and appends it to the
   * linked list in the Wasm module.
   */
  add(transaction) {
    const transactions = this.transactions;

    // If an "id" was present in the body of the request, ignore it:
    const { id, ...validTransaction } = transaction;

    // The next ID is just the current max ID + 1:
    const { id: maxId } = transactions.maxBy('id').value();
    const newRecord = { id: maxId + 1, ...validTransaction };

    // Write the new transaction to the database and add to linked list:
    transactions.push(newRecord).write();
    this.addToWasm(newRecord);
    return newRecord;
  }

  /**
   * Find a transaction from db.json based on the specified ID.
   */
  findById(transactionId) {
    return this.transactions.find({ id: transactionId }).value();
  }

  /**
   * Return all transactions from db.json.
   */
  findAll() {
    return this.transactions.value();
  }

  /**
   * Updates the transaction matching the specified ID with the specified
   * contents, then updates the corresponding transaction node in the
   * Wasm module.
   */
  edit(transactionId, contents) {
    const updatedTransaction = this.transactions
      .find({ id: transactionId })
      .assign(contents)
      .write();

    const { categoryId, ...transaction } = updatedTransaction;
    const amount = this.getValidAmount(transaction);
    this.wasmInstance._editTransaction(transactionId, categoryId, amount);

    return updatedTransaction;
  }

  /**
   * Deletes the transaction associated with the specified ID and removes
   * it from the linked list in the Wasm module.
   */
  remove(transactionId) {
    const result = this.transactions.remove({ id: transactionId }).write();
    if (result.length === 0) throw new Error('Transaction not found');
    this.wasmInstance._removeTransaction(transactionId);
  }

  /**
   * Populates the linked list in the Wasm module. This is only called
   * once, when a new Transaction instance is created.
   */
  populateInWasm() {
    const transactions = this.transactions
      .sortBy(['transactionDate', 'id'])
      .value();
    transactions.forEach(transaction => this.addToWasm(transaction));
  }

  /**
   * Returns the total sum of all transactions.
   */
  getGrandTotal() {
    return this.wasmInstance._getGrandTotal();
  }

  getTotalForCategory(categoryId) {
    // Ensure the totals reflect the most recent transactions:
    this.wasmInstance._recalculateForCategories();

    // Find the category record in db.json that matches the specified ID
    // and include the category's details in the result:
    const category = this.categories.find({ id: categoryId }).value();
    return {
      ...category,
      total: this.wasmInstance._getTotalForCategory(categoryId),
    };
  }

  /**
   * Returns an object that has category totals for all income (deposit)
   * and expenses (withdrawal) transactions.
   */
  getTotalsForAllCategories() {
    // Ensure the totals reflect the most recent transactions:
    this.wasmInstance._recalculateForCategories();

    // Loop through the category records in db.json and find the totals
    // for each one:
    const totalsByGroup = { income: [], expenses: [] };
    this.categories.value().forEach(category => {
      const categoryTotal = {
        ...category,
        total: this.wasmInstance._getTotalForCategory(category.id),
      };
      totalsByGroup[category.type].push(categoryTotal);
    });
    return totalsByGroup;
  }
}

module.exports = Transaction;
