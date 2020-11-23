import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    cart: {
      items: [],
    },
    cartTotal: 0,
  },
});

export default store;
