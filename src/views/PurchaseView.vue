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

          <div class="alert alert-danger fade show mt-3" role="alert" v-if="parseFloat(transactionData.money) > parseFloat(availableFunds)">
            <strong>You don't have enough money</strong>
          </div>

          <button v-else type="button" class="btn mt-3" data-bs-toggle="modal" data-bs-target="#exampleModal">Purchase</button>

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
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="Purchase">Yes</button>
                     <button type="button"  class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="alert alert-success alert-dismissible fade show mt-3" role="alert" v-if="purchaseSuccess" >
           Thank you {{ user }}!<br /> <strong>Successful Purchase</strong>
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
    const purchaseSuccess = ref(false);
    const calculatedPrice = ref(null);
    const cryptoData = reactive({
      btc: {},
      eth: {},
      usdc: {},
      sol: {},
    });

    // Computed
    const user = computed(() => store.state.id);
    const availableFunds = store.state.availableFunds;
    const btcAmount = store.state.btcAmount;
    const ethAmount = store.state.ethAmount;
    const usdcAmount = store.state.usdcAmount;
    const solAmount = store.state.solAmount;

    // Transaction Data
    const transactionData = {
      user_id: ref(null),
      action: "purchase",
      crypto_code: ref(null),
      crypto_amount: ref(null),
      money: ref(null),
      datetime: ref(null),
    };

    // Computed
    const validation = computed(() => {
      return selectedCrypto.value == "" || enteredAmount.value == "";
    });

    // Methods
    const validateKey = (event) => {
      return event.keyCode !== 189 && event.keyCode !== 187 && event.keyCode !== 69;
    };

    const Purchase = async () => {
      if (isNaN(parseFloat(transactionData.money)) || isAxiosError(parseFloat(transactionData.money))) {
        console.log("Valor ingresado incorrecto");
      } else {
        try {

           console.log('Transaction Data:', transactionData);
          await laboApi.transaction(transactionData);
          console.log("Enviado");

          // Update available funds
          const remainingFunds = availableFunds - transactionData.money;
          store.commit("setAvailableFunds", remainingFunds);
          console.log('Remaining Funds:', remainingFunds);

          // Update amounts
          switch (transactionData.crypto_code) {
            case "btc":
              store.commit("setBTC",  parseFloat(btcAmount) +  parseFloat(transactionData.money));
              break;
            case "eth":
              store.commit("setETH",  parseFloat(ethAmount) +  parseFloat(transactionData.money));
              break;
            case "usdc":
              store.commit("setUSDC",  parseFloat(usdcAmount) +  parseFloat(transactionData.money));
              break;
            case "sol":
              store.commit("setSOL",  parseFloat(solAmount) +  parseFloat(transactionData.money));
              break;
          }

          // Reload page after successful purchase
          setTimeout(() => {
            location.reload();
          }, 2000);

          purchaseSuccess.value = true;
        } catch (error) {
          console.error("Error en la compra", error);
        }
      }
    };

    const GetPrice = async () => {
    try {
    const btcResponse = await cryptoyaApi.getBTC();
    console.log('BTC Response:', btcResponse.data);

    const ethResponse = await cryptoyaApi.getETH();
    console.log('ETH Response:', ethResponse.data);

    const usdcResponse = await cryptoyaApi.getUSDC();
    console.log('USDC Response:', usdcResponse.data);

    const solResponse = await cryptoyaApi.getSOL();
    console.log('SOL Response:', solResponse.data);

    cryptoData.btc = btcResponse.data;
    cryptoData.eth = ethResponse.data;
    cryptoData.usdc = usdcResponse.data;
    cryptoData.sol = solResponse.data;
  } catch (error) {
    console.error('Error in GetPrice:', error);
  }
};

    // Watchers
    watch(selectedCrypto, (value) => {
      transactionData.crypto_code = value;
       console.log("Selected Crypto:", value);
    });

    watch(enteredAmount, (value) => {
      transactionData.crypto_amount = value;
      switch (selectedCrypto.value) {
        case "btc":
          calculatedPrice.value = (value * cryptoData.btc.totalAsk).toFixed();
          break;
        case "eth":
          calculatedPrice.value = (value * cryptoData.eth.totalAsk).toFixed();
          break;
        case "usdc":
          calculatedPrice.value = (value * cryptoData.usdc.totalAsk).toFixed();
          break;
        case "sol":
          calculatedPrice.value = (value * cryptoData.sol.totalAsk).toFixed();
          break;
      }

      transactionData.money = calculatedPrice.value;
    });

    // Initialization
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${`00${date.getMonth() + 1}`.slice(-2)}-${`00${date.getDate()}`.slice(-2)}T${`00${date.getHours()}`.slice(-2)}:${`00${date.getMinutes()}`.slice(-2)}`;
    transactionData.datetime = formattedDate;
    transactionData.user_id = store.state.id;
    transactionData.action = "purchase";
    transactionData.crypto_amount = enteredAmount.value;
    transactionData.money = calculatedPrice.value;
    transactionData.crypto_code = selectedCrypto.value;

    // Console Log
    console.log('Transaction Data:', transactionData);

    // Get initial prices
    onBeforeMount(() => {
      GetPrice();
    });

    return {
      user,
      selectedCrypto,
      calculatedPrice,
      transactionData,
      purchaseSuccess,
      availableFunds,
      Purchase,
      validation,
      enteredAmount,
      cryptoData,
      GetPrice,
      validateKey
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
