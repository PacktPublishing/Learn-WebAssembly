import App from './components/App.js';
import { store, initializeStore } from './store/store.js';

// This allows us to use the <vue-numeric> component globally:
Vue.use(VueNumeric.default);

// Create a globally accessible store (without having to pass it down
// as props):
window.$store = store;

// Since we can only pass numbers into a Wasm function, these flags
// represent the amount type we're trying to calculate:
window.AMOUNT_TYPE = {
  raw: 1,
  cooked: 2
};

// After fetching the transactions and initializing the Wasm module,
// render the app.
initializeStore()
  .then(() => {
    new Vue({ render: h => h(App), el: '#app' });
  })
  .catch(err => {
    console.error(err);
  });
