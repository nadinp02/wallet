<template>
  <div>
    <navbar></navbar>
    <h4 class="text-center mt-5">Current Funds: <strong>${{ parseFloat(availableFunds).toFixed(2) }}</strong></h4>
    <div class="container" v-if="response">
      <h2 class="text-center m-5">Cryptocurrency Prices</h2>
      <div class="row">
        <div class="col-md-3">
        <div class="card p-4">
          <div class="d-flex justify-content-left items-center">
            <img src="https://www.satoshitango.com/img/currency/BTC.svg">
            <h4 class="text-center">Bitcoin <span>/ARS</span></h4>
          </div>
          <div class="grid gap-2 mt-2">
          <div class="d-flex justify-content-between text-gray-100 leading-none">
            <span>Ask </span><span>${{ state.btc.ask }}</span>
          </div>

          <div class="d-flex justify-content-between text-gray-100 leading-none">
            <span>Bid </span><span>${{ state.btc.bid }}</span>
          </div>
          </div>
         </div>
        </div>
        <div class="col-md-3">
        <div class="card p-4">
           <div class="d-flex justify-content-left items-center">
            <img src="https://www.satoshitango.com/img/currency/ETH.svg">
            <h4 class="text-center">Ethereum <span>/ARS</span></h4>
          </div>
          <div class="grid gap-2 mt-2">

          <div class="d-flex justify-content-between text-gray-100 leading-none">
            <span>Ask </span><span>${{ state.eth.ask }}</span>
          </div>

          <div class="d-flex justify-content-between text-gray-100 leading-none">
            <span>Bid </span><span>${{ state.eth.bid }}</span>
          </div>
          </div>
          </div>
        </div>
        <div class="col-md-3">
        <div class="card p-4">
          <div class="d-flex justify-content-left items-center">
            <img src="https://www.satoshitango.com/img/currency/USDC.svg">
            <h4 class="text-center">USDC <span>/ARS</span></h4>
          </div>
          <div class="grid gap-2 mt-2">

          <div class="d-flex justify-content-between text-gray-100 leading-none">
            <span>Ask </span><span>${{ state.usdc.ask }}</span>
          </div>

          <div class="d-flex justify-content-between text-gray-100 leading-none">
            <span>Bid </span><span>${{ state.usdc.bid }}</span>
          </div>
          </div>
          </div>
        </div>
         <div class="col-md-3">
         <div class="card p-4">
           <div class="d-flex justify-content-left items-center">
            <img src="https://www.satoshitango.com/img/currency/SOL.svg">
            <h4 class="text-center">SOL <span>/ARS</span></h4>
          </div>
          <div class="grid gap-2 mt-2">

          <div class="d-flex justify-content-between text-gray-100 leading-none">
            <span>Ask </span><span>${{ state.sol.ask }}</span>
          </div>

          <div class="d-flex justify-content-between text-gray-100 leading-none">
            <span>Bid </span><span>${{ state.sol.bid }}</span>
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="d-flex justify-content-center mt-5">
      <div class="spinner-border spinner-border-sm mt-1 me-2" role="status"></div>
      <h5>Loading...</h5>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue';
import cryptoyaApi from '../services/criptoyaApi';
import store from '@/store/index';
import navbar from '../components/NavBar.vue';

export default {
  components: {
    navbar,
  },
  setup() {
    const user = computed(() => store.state.id);
    let availableFunds = computed(() => store.state.availableFunds);
    const state = reactive({
      btc: {},
      eth: {},
      usdc: {},
      sol: {},
    });

    const getPrice = async () => {
      try {
        const btcResponse = await cryptoyaApi.getBTC();
        const ethResponse = await cryptoyaApi.getETH();
        const usdcResponse = await cryptoyaApi.getUSDC();
        const solResponse = await cryptoyaApi.getSOL();

        state.btc = btcResponse.data;
        state.eth = ethResponse.data;
        state.usdc = usdcResponse.data;
        state.sol = solResponse.data;
      } catch (error) {
        console.error('Error al obtener precios:', error);
      }
    };

    onMounted(async () => {
      await getPrice();
    });

    const response = computed(() => {
      return (
        Object.keys(state.btc).length !== 0 &&
        Object.keys(state.eth).length !== 0 &&
        Object.keys(state.usdc).length !== 0 &&
        Object.keys(state.sol).length !== 0
      );
    });

    return {
      user,
      state,
      availableFunds,
      response,
      getPrice,
    };
  },
};
</script>
<style scoped>
span{
  --tw-text-opacity: 1;
  color:rgb(145 146 179/var(--tw-text-opacity))
}
.card{
   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.graphicCard {
  margin-top: 16px;
}
img{
  width:30px;
  margin-right: 5px;
}
h4{
  margin: 0;
}
@media screen and (max-width: 768px){
  .card{
    margin-bottom: 15px
  }
  
}
</style>
