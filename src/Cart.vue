<template>
    <div>
        <h1>Cart</h1>

        <table v-if="cart.items.length > 0" class="table table-striped">
            <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="item in cart.items">
                <td>{{ item.product.name }}</td>
                <td>
                    {{ item.quantity }} &nbsp;
                    <button class="btn btn-success" @click="increaseQuantity(item)" :disabled="item.product.inStock == 0">+</button>
                    <button class="btn btn-danger" @click="decreaseQuantity(item)">-</button>
                </td>
                <td>{{ item.quantity * item.product.price | currency }}</td>
            </tr>

            <tr>
                <td class="text-right" colspan="2">
                    <strong>Subtotal</strong>
                </td>

                <td>{{ cartTotal | currency }}</td>
            </tr>

            <tr>
                <td class="text-right" colspan="2">
                    <strong>Taxes</strong>
                </td>

                <td>{{ taxAmount(10) | currency }}</td>
            </tr>
            <tr>
                <td class="text-right" colspan="2">
                    <strong>Coupne Code</strong>
                </td>
                <td><input v-model="couponCode" type="text" class="form-control" placehoder="Enter coupon code here"></td>
            </tr>
            <tr>
                <td class="text-right" colspan="2">
                    <strong>Grand total</strong>
                </td>

                <td>{{ cartTotal + taxAmount(10) | currency }}</td>
            </tr>

            <tr>
                <td colspan="2" class="text-right">
                    <span v-if="couponCode">
                        <em>Lucky you! You entered the folowing coupon code {{ couponCode }}</em>
                    </span>
                </td>
                <td><button class="btn btn-success" @click="checkout">Checkout</button></td>
            </tr>
            </tbody>
        </table>

        <p v-else>Your cart is currently empty.</p>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { CHECKOUT, UPDATE_COUPON_CODE } from "./mutations-types";
    export default {
        // TODO: Access cart items, cart total, and tax amount
        computed:{
            ...mapGetters([
                'cartTotal',
                'taxAmount'
            ]),
            cart(){
                return this.$store.state.cart;
            },
            couponCode:{
                get(){
                   return  this.$store.state.couponCode;
                },
                set(value){
                    this.$store.commit(UPDATE_COUPON_CODE, value)
                }
            }
        },

        // TODO: Implement increaseQuantity method

        // TODO: Implement decreaseQuantity method

        // TODO: Implement checkout method
        methods:{
            ...mapMutations([
                CHECKOUT
            ]),
            addProductToCart(product, quantity){
                this.$store.commit('addProductToCart', {
                    product, 
                    quantity
                })
            }
        },

        beforeRouteLeave(to, from, next) {
            if (this.cart.items.length > 0) {
                if (!confirm('Are you sure you don\'t want to buy these amazing products?')) {
                    return next(false);
                }
            }
            next();
        }
    }
</script>