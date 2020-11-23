import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes';

Vue.filter('currency', function(value) {
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });
    
    return formatter.format(value);
});

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(VueRouter);

const router = new VueRouter({
    routes: routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash
            };
        }
        
        if (savedPosition) {
            return savedPosition;
        }
        
        return { x: 0, y: 0 };
    }
});

/**
 * @params implement getters to maintian state reusability
 * always returns the value.
 */
const store = new Vuex.Store({
    state: {
        cart:{
            items: []
        }
    },
    getters: {
        cartTotal: (state) =>{
            let total = 0;
            state.cart.items.forEach(function(item){
                total += item.product.price * item.quantity;
            })

            return total;
        },
        taxAmount(state, getters){
            return ((getters.cartTotal * 10)/ 100)
        }
    }
})
Vue.http.options.root = 'http://localhost:3000';

new Vue({
    el: '#app',
    render: h => h(App),
    router: router,
    store: store
});