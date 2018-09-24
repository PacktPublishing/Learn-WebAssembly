import PieChart from './PieChart.js';

/**
 * This component contains two instances of the PieChart component:
 * one for Income and one for Expenses. It represents the "Charts" tab
 * within the application.
 */
export default {
  name: 'charts-tab',
  components: {
    PieChart
  },
  props: {
    // Indicates if this is the currently active tab:
    isActive: Boolean
  },
  data() {
    return {
      incomeData: [],
      expensesData: []
    };
  },
  methods: {
    updateCategoryTotals() {
      const { income, expenses } = $store.wasm.getCategoryTotals();
      this.incomeData = income;
      this.expensesData = expenses;
    }
  },
  watch: {
    // Whenever the tab is activated, recalculate the category totals
    // and redraw the pie charts:
    isActive() {
      this.updateCategoryTotals();
    }
  },
  mounted() {
    this.updateCategoryTotals();
  },
  template: `
    <div class="uk-width-1-1 uk-margin-remove-top">
      <div
        uk-grid
        class="uk-child-width-1-2 uk-padding uk-padding-remove-top"
      >
        <div>
          <pie-chart title="Income" :chartData="incomeData">
          </pie-chart>
        </div>
        <div>
          <pie-chart title="Expenses" :chartData="expensesData">
          </pie-chart>
        </div>
      </div>
    </div>
  `
};
