import ConfirmationModal from './ConfirmationModal.js';

/**
 * This component contains a table of all the transactions with buttons
 * to edit or remove records.
 */
export default {
  name: 'transactions-table',
  components: {
    ConfirmationModal
  },
  props: {
    onTransactionChange: Function
  },
  data() {
    return {
      confirmationModalShown: false,
      pendingTransaction: {}
    };
  },
  methods: {
    // Updates the formatting for the transaction date and amounts fields
    // for display in the table:
    getFormattedTransactions() {
      const getDisplayAmount = (type, amount) => {
        if (amount === 0) return accounting.formatMoney(amount);
        return accounting.formatMoney(amount, {
          format: { pos: '%s %v', neg: '%s (%v)' }
        });
      };

      const getDisplayDate = transactionDate => {
        if (!transactionDate) return '';
        const parsedTime = d3.timeParse('%Y-%m-%d')(transactionDate);
        return d3.timeFormat('%m/%d/%Y')(parsedTime);
      };

      return $store.state.transactions.map(
        ({
          type,
          rawAmount,
          cookedAmount,
          transactionDate,
          ...transaction
        }) => ({
          ...transaction,
          type,
          rawAmount: getDisplayAmount(type, rawAmount),
          cookedAmount: getDisplayAmount(type, cookedAmount),
          transactionDate: getDisplayDate(transactionDate)
        })
      );
    },

    onEditClick(transaction) {
      $store.showTransactionModal(transaction.id);
    },

    // Clicking the remove button doesn't remove the transaction, the
    // user must confirm the action through the Confirmation Modal
    // component:
    onRemoveClick(transaction) {
      this.pendingTransaction = { ...transaction };
      this.confirmationModalShown = true;
    },

    onConfirmationNoClick() {
      this.confirmationModalShown = false;
    },

    // If confirmed, remove the transaction:
    onConfirmationYesClick() {
      this.confirmationModalShown = false;
      $store.removeTransaction(this.pendingTransaction);
      this.pendingTransaction = {};
      this.onTransactionChange();
    },

    // The "tableAmount" class is always present, but the text should
    // only be red if the value is negative:
    getAmountClass(value) {
      return {
        'uk-text-danger': /\(/g.test(value),
        tableAmount: true
      };
    }
  },
  watch: {
    // Listen for when the confirmationModalShown value in local state
    // changes and either show or hide the modal based on the new value:
    confirmationModalShown(newValue) {
      const confirmationModal = document.querySelector(
        '#confirmationModal'
      );
      if (newValue) {
        UIkit.modal(confirmationModal).show();
      } else {
        UIkit.modal(confirmationModal).hide();
      }
    }
  },
  template: `
    <div>
      <table class="uk-table uk-table-divider uk-table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Date</th>
            <th>Type</th>
            <th>To/From</th>
            <th>Category</th>
            <th>Raw Amount</th>
            <th>Cooked Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in getFormattedTransactions()">
            <td class="uk-table-shrink">
              <div class="uk-button-group">
                <a
                  class="uk-icon-link uk-reset uk-margin-small-right"
                  uk-icon="file-edit"
                  @click="() => onEditClick(transaction)"></a>
                <a
                  class="uk-icon-link uk-reset uk-margin-small-right"
                  uk-icon="trash"
                  @click="() => onRemoveClick(transaction)"></a>
              </div>
            </td>
            <td>{{ transaction.transactionDate }}</td>
            <td>{{ transaction.type }}</td>
            <td>{{ transaction.toFrom }}</td>
            <td>{{ transaction.category }}</td>
            <td :class="getAmountClass(transaction.rawAmount)"
            >{{ transaction.rawAmount }}</td>
            <td :class="getAmountClass(transaction.cookedAmount)"
            >{{ transaction.cookedAmount }}</td>
          </tr>
        </tbody>
      </table>
      <confirmation-modal
        :onNoClick="onConfirmationNoClick"
        :onYesClick="onConfirmationYesClick">
      </confirmation-modal>
    </div>
  `
};
