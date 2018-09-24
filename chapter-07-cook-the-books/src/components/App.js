import BalancesBar from './BalancesBar/BalancesBar.js';
import ChartsTab from './ChartsTab/ChartsTab.js';
import TransactionsTab from './TransactionsTab/TransactionsTab.js';

/**
 * This component is the entry point for the application. It contains the
 * header, tabs, and content.
 */
export default {
  name: 'app',
  components: {
    BalancesBar,
    ChartsTab,
    TransactionsTab
  },
  data() {
    return {
      balances: $store.state.balances,
      activeTab: 0
    };
  },
  methods: {
    // Any time a transaction is added, edited, or removed, we need to
    // ensure the balance is updated:
    onTransactionChange() {
      $store.recalculateBalances();
      this.balances = $store.state.balances;
    },

    // When the "Charts" tab is activated, this ensures that the charts
    // get automatically updated:
    onTabClick(event) {
      this.activeTab = +event.target.dataset.tab;
    }
  },
  template: `
    <div>
      <div class="appHeader uk-background-primary uk-flex uk-flex-middle">
        <h2 class="uk-light uk-margin-remove-bottom uk-margin-left">
          Cook the Books
        </h2>
      </div>
      <div class="uk-position-relative">
        <ul uk-tab class="uk-margin-small-bottom uk-margin-top">
          <li class="uk-margin-small-left">
            <a href="#" data-tab="0" @click="onTabClick">Transactions</a>
          </li>
          <li>
            <a href="#" data-tab="1" @click="onTabClick">Charts</a>
          </li>
        </ul>
        <balances-bar
          :balances="balances"
          :onTransactionChange="onTransactionChange">
        </balances-bar>
        <ul class="uk-switcher">
          <li>
            <transactions-tab :onTransactionChange="onTransactionChange">
            </transactions-tab>
          </li>
          <li>
            <charts-tab :isActive="this.activeTab === 1"></charts-tab>
          </li>
        </ul>
      </div>
    </div>
  `
};
