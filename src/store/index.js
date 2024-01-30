import { createStore } from 'vuex';

export default createStore({
  state: {
    id: localStorage.getItem('id'),
    password: localStorage.getItem('password'),
    availableFunds: localStorage.getItem('money'),
    btcamount : localStorage.getItem('btc'),
    usdcamount: localStorage.getItem('usdc'),
    ethamount: localStorage.getItem('eth'),
    solamount: localStorage.getItem('sol')
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
    setAvailableFunds: (state, funds) => {
      state.availableFunds = funds;
      localStorage.setItem('money', funds);
    },
    setBTC(state, btcamount){
      state.btcamount = btcamount;
      localStorage.setItem('btc',btcamount)
    },
    setETH(state,ethamount){
      state.ethamount = ethamount;
      localStorage.setItem('eth',ethamount)
    },
    setUSDC(state, usdcamount){
      state.usdcamount = usdcamount;
      localStorage.setItem('usdc',usdcamount)
    },
    setSOL(state, solamount){
      state.solamount = solamount;
      localStorage.setItem('sol',solamount)
    }
  },
  actions: {
  },

});
