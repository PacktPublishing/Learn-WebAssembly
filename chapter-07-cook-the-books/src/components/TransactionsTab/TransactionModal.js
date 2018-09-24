const emptyTransaction = { id: 0, rawAmount: 0, cookedAmount: 0 };

/**
 * This component is used to either add or edit a transaction. When they
 * press the Save button, it performs the appropriate update.
 */
export default {
  name: 'transaction-modal',
  props: {
    transactionId: Number,
    onTransactionChange: Function
  },
  data() {
    return {
      // By using the spread operator (...), we're not directly assigning
      // emptyTransaction to activeTransaction, we're making a copy:
      activeTransaction: { ...emptyTransaction },
      categoryOptions: $store.getCategories()
    };
  },
  watch: {
    transactionId(newValue) {
      // A transactionId of 0 represents a new transaction:
      if (newValue === 0) {
        this.resetTransaction();
      } else {
        const {
          rawAmount,
          cookedAmount,
          ...rest
        } = $store.getActiveTransaction();

        // We use the spread operator so we don't update the transaction
        // in global state, just locally. That way, if the user presses
        // the "Cancel" button, none of the changes persisted:
        this.activeTransaction = {
          ...rest,
          rawAmount: Math.abs(rawAmount),
          cookedAmount: Math.abs(cookedAmount)
        };
      }
    }
  },
  methods: {
    resetTransaction() {
      this.activeTransaction = { ...emptyTransaction };
    },

    onCancelClick() {
      $store.hideTransactionModal();
    },

    onSaveClick() {
      // First, either add or update the transaction:
      if (this.activeTransaction.id === 0) {
        $store.addTransaction(this.activeTransaction);
      } else {
        $store.editTransaction(this.activeTransaction);
      }

      // Second, clear out the transaction values in local state so if
      // the user wants to add a new transaction, the values from the
      // last add/edit won't be present:
      this.resetTransaction();

      // Finally, fire the onTransactionChange function prop to trigger
      // a balance recalculation:
      this.onTransactionChange();
    }
  },
  template: `
    <div id="transactionModal" uk-modal esc-close="false" bg-close="false">
      <div class="uk-modal-dialog">
        <div class="uk-modal-header uk-background-primary">
          <h2 class="uk-modal-title uk-background-primary uk-light">
            Transaction Details
          </h2>
        </div>
        <div class="uk-modal-body">
          <form uk-grid class="uk-grid-medium">
            <div class="uk-width-1-2">
              <label class="uk-form-label" for="transactionDate">
                Date
              </label>
              <div class="uk-form-controls">
                <input 
                  v-model="activeTransaction.transactionDate"
                  id="transactionDate"
                  class="uk-input"
                  type="date">
              </div>
            </div>
            <div class="uk-width-1-2 uk-margin-remove-top">
              <label class="uk-form-label" for="type">Type</label>
              <div class="uk-form-controls">
                <select
                  v-model="activeTransaction.type"
                  id="type"
                  class="uk-select"
                >
                  <option>Deposit</option>
                  <option>Withdrawal</option>
                </select>
              </div>
            </div>
            <div class="uk-width-1-1">
              <label class="uk-form-label" for="toFrom">To/From</label>
              <div class="uk-form-controls">
                <input 
                  v-model="activeTransaction.toFrom"
                  id="toFrom"
                  class="uk-input"
                  type="text">
              </div>
            </div>
            <div class="uk-width-1-1">
              <label class="uk-form-label" for="category">Category</label>
              <div class="uk-form-controls">
                <select
                  v-model="activeTransaction.category"
                  id="category"
                  class="uk-select"
                >
                  <option
                    v-for="categoryOption in this.categoryOptions"
                    :value="categoryOption"
                  >
                    {{ categoryOption }}
                  </option>
                </select>
              </div>
            </div>
            <div class="uk-width-1-2">
              <label class="uk-form-label" for="rawAmount">
                Raw Amount
              </label>
              <div class="uk-form-controls">
                <vue-numeric
                  v-model="activeTransaction.rawAmount"
                  id="rawAmount"
                  class="uk-input"
                  precision="2"
                  currency="$"
                  separator=",">
                </vue-numeric>
              </div>
            </div>
            <div class="uk-width-1-2">
              <label class="uk-form-label" for="cookedAmount">
                Cooked Amount
              </label>
              <div class="uk-form-controls">
                <vue-numeric
                  v-model="activeTransaction.cookedAmount"
                  id="cookedAmount"
                  class="uk-input"
                  precision="2"
                  currency="$"
                  separator=",">
                </vue-numeric>
              </div>
            </div>
            <div class="uk-width-1-1">
              <label class="uk-form-label" for="description">
                Description
              </label>
              <div class="uk-form-controls">
                <input
                  v-model="activeTransaction.description"
                  id="description"
                  class="uk-input"
                  type="text">
              </div>
            </div>
          </form>
        </div> 
        <div class="uk-modal-footer uk-text-right">
          <button
            @click="onCancelClick"
            class="uk-button uk-button-default uk-margin-small-right"
          >
            Cancel
          </button>
          <button
            @click="onSaveClick"
            class="uk-button uk-button-primary"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  `
};
