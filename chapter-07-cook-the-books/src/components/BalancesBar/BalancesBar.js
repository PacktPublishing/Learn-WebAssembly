import BalanceCard from './BalanceCard.js';

/**
 * This component is used to layout four of the BalanceCard components
 * in a single row: two for the raw balances and two for the cooked
 * balances.
 */
export default {
  name: 'balances-bar',
  components: {
    BalanceCard
  },
  props: {
    balances: Object,
    onTransactionChange: Function
  },
  methods: {
    // This ensures that the balances are recalculated whenever a change
    // is made to one of the initial balances:
    onBalanceChange(amount, fieldName) {
      $store.updateInitialBalance(amount, fieldName);
      this.onTransactionChange();
    }
  },
  template: `
    <div class="uk-width-1-1">
      <div uk-grid class="uk-child-width-1-4 uk-grid-match uk-padding">
        <balance-card
          title="Initial Raw Balance"
          :value="balances.initialRaw"
          :onChange="amount => onBalanceChange(amount, 'initialRaw')">
        </balance-card>
        <balance-card
          title="Current Raw Balance"
          :value="balances.currentRaw">
        </balance-card>
        <balance-card
          title="Initial Cooked Balance"
          :value="balances.initialCooked"
          :onChange="amount => onBalanceChange(amount, 'initialCooked')">
        </balance-card>
        <balance-card
          title="Current Cooked Balance"
          :value="balances.currentCooked">
        </balance-card>
      </div>
    </div>
  `
};
