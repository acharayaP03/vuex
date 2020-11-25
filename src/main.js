import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes';
import {ADD_PORDUCT_TO_CART, CHECKOUT, INCREASE_PRODUCT_QUANTITY } from './mutations-types'

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
        taxAmount: (state, getters) =>{
            return function(percentage){
                return ((getters.cartTotal * percentage)/ 100)
            }
        },
        getCartItem: (state) => (product)=>{
            for(let i= 0; i< state.cart.items.length; i++){
                if(state.cart.items[i].product.id === product.id){
                    return state.cart.items[i];
                }
            }
            return null;
        }
    },
    /**
     * @usage Use action when there is a need to  async request to the 
     * @mutation are synchronous, we cannot use it for async such as server request.
     */
    actions:{
        [ADD_PORDUCT_TO_CART]({commit, getters}, payload){
            let cartItem = getters.getCartItem(payload.product);
            payload.cartItem = cartItem;

            if(cartItem == null){
                commit(ADD_PORDUCT_TO_CART, payload)
            }else{
                commit(INCREASE_PRODUCT_QUANTITY, payload)
            }
        }
    },

    mutations:{
        /**
         * 
         * @param dynamically setting mutation types
         * @types will be replace durin the render.
         */
        [CHECKOUT](state){
            state.cart.items.forEach(function(item) {
                item.product.inStock += item.quantity;
            });
            
            state.cart.items = [];    
        },
        [ADD_PORDUCT_TO_CART](state, payload) {
            console.log(payload)
            if (payload.cartItem !==null){
                payload.cartItem.quantity += payload.quantity;
            }else{
                state.cart.items.push({
                    product: payload.product,
                    quantity: payload.quantity
                })
            }
            payload.product.inStock -= payload.quantity;
        },
        [INCREASE_PRODUCT_QUANTITY](state, payload){
            console.log(payload)
            payload.cartItem.quantity += payload.quantity;
            payload.product.inStock -= payload.quantity;
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