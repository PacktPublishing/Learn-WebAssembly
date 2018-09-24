/**
 * This component is used to display the raw or cooked balance and
 * enables the user to update the initial balance for either type.
 */
export default {
  name: 'balance-card',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      default: 0
    },
    onChange: Function
  },
  computed: {
    // Makes the text red for negative amounts (in both the display value
    // and the input):
    negativeClass() {
      return {
        'uk-text-danger': this.value < 0
      };
    }
  },
  template: `
    <div>
      <div class="uk-card uk-card-default uk-card-small">
        <div class="uk-card-header">
          <h5 class="uk-text-uppercase uk-text-muted">{{ title }}</h5>
        </div>
        <div class="uk-card-body">
          <vue-numeric
            v-if="onChange"
            v-model="value"
            :class="[negativeClass, 'uk-input', 'balanceEntry']"
            @input="onChange"
            precision="2"
            currency="$"
            separator=","
            minus="true">
          </vue-numeric>
          <h2 v-else :class="negativeClass">
            {{ accounting.format(value) }}
          </h2>
        </div>
      </div>
    </div>
  `
};
