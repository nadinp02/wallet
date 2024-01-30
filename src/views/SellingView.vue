<template>
  <navbar></navbar>
    <div class="container">
     <h4 class="text-center mt-5">Current Funds: <strong>${{ parseFloat(availableFunds).toFixed(2) }}</strong></h4>
      <div class="row">
       
        <form >
          <div class="d-flex align-items-center justify-content-between">
            <div>
             <p><b>Choose the cryptocurrency</b></p>
              <select id="coin" v-model="selectedCrypto" class="select w-100">
              <option value="usdc">USDC</option>
             <option value="btc">Bitcoin</option>
              <option value="eth">Ethereum</option>
             <option value="sol">SOL</option>
             </select>
            </div>

            <div>
              <p><b>Enter the amount</b></p>
             <input id="mount" type="number" placeholder="0.3456" min="0.00001" v-model="enteredAmount" @keydown="validateKey"/>
            </div>
          </div>

          <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="(selectedCrypto === 'btc' && parseFloat(btcAmount) === 0) || (selectedCrypto === 'eth' && parseFloat(ethAmount) === 0) || (selectedCrypto === 'usdc' && parseFloat(usdcAmount) === 0) || (selectedCrypto === 'sol' && parseFloat(solAmount) === 0)">
            <strong>You don't have enough money</strong>
          </div>
          <div class="alert alert-danger alert-dismissible fade show" role="alert" v-else-if="parseFloat(transactionData.money) > parseFloat(availableFunds)">
            <strong>You exceeded the amount you have</strong>
          </div>

          <button type="button" class="btn mt-3" data-bs-toggle="modal" data-bs-target="#exampleModal" v-else>Sell</button>

          <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div v-if="enteredAmount === null || enteredAmount === 0 || enteredAmount === undefined || enteredAmount === ''">
                  <div class="modal-body">
                    <p><b> Enter the amount...</b></p>
                  </div>
                </div> 
              
                <div v-else-if="selectedCrypto === null">
                  <div class="modal-body">
                    <p><b> Enter the cryptocurrency...</b></p>
                  </div>
                </div>
                
                <div v-else>
                  <div class="modal-body">
                    <h3><b> Are you sure?</b></h3>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="Sell">Yes</button>
                     <button type="button"  class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="alert alert-success alert-dismissible fade show mt-3" role="alert" v-if="sellingSuccess" >
           Thank you {{ user }}!<br /> <strong>Successful Selling</strong>
          </div>
        </form>
      <div>
               
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeMount, watch, reactive, computed } from "vue";
import cryptoyaApi from "@/services/criptoyaApi";
import laboApi from "@/services/labo";
import navbar from "@/components/NavBar.vue";
import store from "@/store/index";
import { isAxiosError } from "axios";

export default {
  components: {
    navbar,
  },
  setup() {
    // State
    const enteredAmount = ref(null);
    const selectedCrypto = ref(null);
    const sellingSuccess = ref(false);
    const calculatedPrice = ref(null);
    const cryptoData = reactive({
      btc: {},
      eth: {},
      usdc: {},
    });

    // Computed
    const user = computed(() => store.state.id);
    const availableFunds = store.state.availableFunds;
    const btcAmount = store.state.btcAmount;
    const ethAmount = store.state.ethAmount;
    const usdcAmount = store.state.usdcAmount;
    const solAmount = store.state.solAmount;


    // Transaction Data
    const transactionData = reactive({
      user_id: ref(null),
      action: "sale",
      crypto_code: ref(null),
      crypto_amount: ref(null),
      money: ref(null),
      datetime: ref(null),
    });

    // Watchers
    watch(selectedCrypto, (newValue) => {
      transactionData.crypto_code = newValue;
    });

    watch(enteredAmount, (valor) => {
      transactionData.crypto_amount = valor;

      switch (selectedCrypto.value) {
        case "btc":
          calculatedPrice.value = (valor * cryptoData.btc.totalBid).toFixed();
          break;
        case "eth":
          calculatedPrice.value = (valor * cryptoData.eth.totalBid).toFixed();
          break;
        case "usdc":
          calculatedPrice.value = (valor * cryptoData.usdc.totalBid).toFixed();
          break;
        case "sol":
          calculatedPrice.value = (valor * cryptoData.sol.totalBid).toFixed();
          break;
      }

      transactionData.money = calculatedPrice.value;
    });

    // Methods
    const GetPrice = async () => {
      const btcResponse = await cryptoyaApi.getBTC();
      const ethResponse = await cryptoyaApi.getETH();
      const usdcResponse = await cryptoyaApi.getUSDC();
      const solResponse = await cryptoyaApi.getSOL();

      cryptoData.btc = btcResponse.data;
      cryptoData.eth = ethResponse.data;
      cryptoData.usdc = usdcResponse.data;
      cryptoData.sol = solResponse.data;
    };

    const Sell = async () => {
      if (
        isNaN(parseFloat(transactionData.money)) ||
        isAxiosError(parseFloat(transactionData.money))
      ) {
        console.log("Valor ingresado incorrecto");
      } else {
        const remainingFunds =
          parseFloat(availableFunds) + parseFloat(transactionData.money);

        store.commit("setAvailableFunds", remainingFunds);

        try {
          await laboApi.transaction(transactionData);

          // Update amounts
          let totalusdc = parseFloat(usdcAmount) - parseFloat(transactionData.money);
          let totaleth = parseFloat(ethAmount) - parseFloat(transactionData.money);
          let totalbtc = parseFloat(btcAmount) - parseFloat(transactionData.money);
          let totalsol = parseFloat(solAmount) - parseFloat(transactionData.money);

          switch (transactionData.crypto_code) {
            case "btc":
              store.commit("setBTC", totalbtc);
              break;
            case "eth":
              store.commit("setETH", totaleth);
              break;
            case "usdc":
              store.commit("setUSDC", totalusdc);
              break;
            case "sol":
              store.commit("setSOL", totalsol);
              break;
          }

          setTimeout(() => {
            location.reload();
          }, 2000);

          sellingSuccess.value = true;
        } catch (error) {
          console.error("Error en la venta", error.response.data);
        }
      }
    };

    // Initialization
    onBeforeMount(() => {
      GetPrice();
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${`00${
        date.getMonth() + 1
      }`.slice(-2)}-${`00${date.getDate()}`.slice(
        -2
      )}T${`00${date.getHours()}`.slice(-2)}:${`00${date.getMinutes()}`.slice(
        -2
      )}`;

      transactionData.datetime = formattedDate;
      transactionData.user_id = store.state.id;
      transactionData.action = "sale";
      transactionData.crypto_amount = enteredAmount.value;
      transactionData.money = calculatedPrice.value;
      transactionData.crypto_code = selectedCrypto.value;
    });

     const validateKey = (event) => {
      return event.keyCode !== 189 && event.keyCode !== 187 && event.keyCode !== 69;
    };

    return {
      ethAmount,
      btcAmount,
      usdcAmount,
      solAmount,
      selectedCrypto,
      sellingSuccess,
      availableFunds,
      transactionData,
      user,
      Sell,
      enteredAmount,
      cryptoData,
      GetPrice,
      validateKey,
    };
  },
};
</script>

<style scoped>
.btn {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background: linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180)) 0% 0% / auto repeat scroll padding-box border-box rgb(82, 67, 170);
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }

 .btn:hover {
  background: linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180)) 0% 0% / auto repeat scroll padding-box border-box rgb(82, 67, 170);
  }

</style>
