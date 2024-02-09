import { createStore } from 'vuex';

export default createStore({
  state: {
    id: localStorage.getItem('id'),
    password: localStorage.getItem('password'),
    availableFunds: localStorage.getItem('money'),
    btcAmount : localStorage.getItem('btc'),
    usdcAmount: localStorage.getItem('usdc'),
    ethAmount: localStorage.getItem('eth'),
    solAmount: localStorage.getItem('sol')
  },
  mutations: {
    setId(state, id) {
      state.id = id;
      localStorage.setItem('id',id)
    },
    setPassword(state, password){
      state.password = password;
      localStorage.setItem('password',password)
    },
    setAvailableFunds(state, funds) {
      state.availableFunds = funds;
      localStorage.setItem('money', funds);
    },
    setBTC(state, btcAmount){
      state.btcAmount = btcAmount;
      localStorage.setItem('btc',btcAmount)
    },
    setETH(state,ethAmount){
      state.ethAmount = ethAmount;
      localStorage.setItem('eth',ethAmount)
    },
    setUSDC(state, usdcAmount){
      state.usdcAmount = usdcAmount;
      localStorage.setItem('usdc',usdcAmount)
    },
    setSOL(state, solAmount){
      state.solAmount = solAmount;
      localStorage.setItem('sol',solAmount)
    }
  },
  actions: {
  },

});
