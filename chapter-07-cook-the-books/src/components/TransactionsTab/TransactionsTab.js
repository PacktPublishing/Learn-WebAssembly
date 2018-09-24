import TransactionModal from './TransactionModal.js';
import TransactionsTable from './TransactionsTable.js';

/**
 * This component contains the TransactionsTable and TransactionModal
 * components and represents the "Entry" tab within the application.
 */
export default {
  name: 'transactions-tab',
  components: {
    TransactionModal,
    TransactionsTable
  },
  props: {
    onTransactionChange: Function
  },
  data() {
    return {
      sharedState: $store.state
    };
  },
  methods: {
    onAddClick() {
      $store.showTransactionModal();
    }
  },
  template: `
    <div>
      <div class="uk-width-1-1 uk-margin-remove-top">
        <transactions-table :onTransactionChange="onTransactionChange">
        </transactions-table>
        <a
          class="uk-icon-button addTransactionButton"
          uk-icon="plus"
          ratio="1.7"
          @click="onAddClick">
        </a>
      </div>
      <transaction-modal
        :transactionId="sharedState.activeTransactionId"
        :onTransactionChange="onTransactionChange">
      </transaction-modal>
    </div>
  `
};
