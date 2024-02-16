<template>
  <navbar></navbar>
  <div class="container">
    <h4 class="text-center mt-5">
      Current Funds: <strong>${{ parseFloat(availableFunds).toFixed(2) }}</strong>
    </h4>
    <div class="row">
      <form>
        <div class="inputs d-flex align-items-center justify-content-between">
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
            <input
              id="mount"
              type="number"
              min="0.00001"
              v-model="enteredAmount"
              @keydown="validateKey"
            />
          </div>
        </div>
        <div
          class="alert alert-danger fade show mt-3"
          role="alert"
          v-if="
            transactionData &&
            parseFloat(transactionData.money) > parseFloat(availableFunds)
          "
        >
          <strong>You don't have enough money</strong>
        </div>

        <button
          type="button"
          class="btn mt-3"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          @click="setAction('purchase')"
        >
          Purchase
        </button>
        <button
          type="button"
          class="btn mt-3"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          @click="setAction('sale')"
        >
          Sell
        </button>
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div
                v-if="
                  enteredAmount === null ||
                  enteredAmount === 0 ||
                  enteredAmount === undefined ||
                  enteredAmount === ''
                "
              >
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
                  <h3>
                    <b> Are you sure you want to {{ transactionData.action }}?</b>
                  </h3>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-success"
                    data-bs-dismiss="modal"
                    @click="executeAction()"
                  >
                    Yes
                  </button>
                  <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="alert alert-success alert-dismissible fade show mt-3"
          role="alert"
          v-if="transactionSuccess"
        >
          Thank you {{ user }}!<br />
          <strong>Successful {{ transactionData.action }}</strong>
        </div>
      </form>
      <div></div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeMount, watch, reactive, computed } from "vue";
import cryptoyaApi from "@/services/criptoyaApi";
import laboApi from "@/services/labo";
import navbar from "@/components/NavBar.vue";
import store from "@/store/index";

export default {
  components: {
    navbar,
  },
  setup() {
    const enteredAmount = ref(null);
    const selectedCrypto = ref(null);
    const transactionSuccess = ref(false);
    const calculatedPrice = ref(null);
    const cryptoData = reactive({
      btc: {},
      eth: {},
      usdc: {},
      sol: {},
    });

    const user = computed(() => store.state.id);
    const availableFunds = store.state.availableFunds;
    const btcAmount = parseFloat(store.state.btcAmount) || 0;
    const ethAmount = parseFloat(store.state.ethAmount) || 0;
    const solAmount = parseFloat(store.state.solAmount) || 0;
    const usdcAmount = parseFloat(store.state.usdcAmount) || 0;

    const transactionData = reactive({
      user_id: user,
      action: null,
      crypto_code: null,
      crypto_amount: null,
      money: null,
      datetime: null,
    });

    const validateKey = (event) => {
      return event.keyCode !== 189 && event.keyCode !== 187 && event.keyCode !== 69;
    };

    const setAction = (selectedAction) => {
      transactionData.action = selectedAction;
    };

    const executeAction = async () => {
      if (selectedCrypto.value && enteredAmount.value && transactionData.action) {
      switch (selectedCrypto.value) {
        case "btc":
          calculatedPrice.value = (enteredAmount.value * (transactionData.action === "purchase" ? cryptoData.btc.totalAsk : cryptoData.btc.totalBid)).toFixed();
          break;
        case "eth":
          calculatedPrice.value = (enteredAmount.value * (transactionData.action === "purchase" ? cryptoData.eth.totalAsk : cryptoData.eth.totalBid)).toFixed();
          break;
        case "usdc":
          calculatedPrice.value = (enteredAmount.value * (transactionData.action === "purchase" ? cryptoData.usdc.totalAsk : cryptoData.usdc.totalBid)).toFixed();
          break;
        case "sol":
          calculatedPrice.value = (enteredAmount.value * (transactionData.action === "purchase" ? cryptoData.sol.totalAsk : cryptoData.sol.totalBid)).toFixed();
          break;
      }
      transactionData.money = calculatedPrice.value;
      }

      try {
        await laboApi.transaction(transactionData);

        const remainingFunds = availableFunds - parseFloat(transactionData.money);
        store.commit("setAvailableFunds", remainingFunds);

        switch (transactionData.crypto_code) {
          case "btc":
            store.commit("setBTC", transactionData.action === "purchase" ? btcAmount + parseFloat(transactionData.money) : btcAmount - parseFloat(transactionData.money));
            break;
          case "eth":
            store.commit("setETH", transactionData.action === "purchase" ? ethAmount + parseFloat(transactionData.money) : ethAmount - parseFloat(transactionData.money));
            break;
          case "usdc":
            store.commit("setUSDC", transactionData.action === "purchase" ? usdcAmount + parseFloat(transactionData.money) : usdcAmount - parseFloat(transactionData.money));
            break;
          case "sol":
            store.commit("setSOL", transactionData.action === "purchase" ? solAmount + parseFloat(transactionData.money) : solAmount - parseFloat(transactionData.money));
            break;
        }

        setTimeout(() => {
          location.reload();
        }, 2000);

        transactionSuccess.value = true;
      } catch (error) {
        console.error("Error en la transacción", error);
      }
    };

    const GetPrice = async () => {
      try {
        const btcResponse = await cryptoyaApi.getBTC();
        const ethResponse = await cryptoyaApi.getETH();
        const usdcResponse = await cryptoyaApi.getUSDC();
        const solResponse = await cryptoyaApi.getSOL();

        cryptoData.btc = btcResponse.data;
        cryptoData.eth = ethResponse.data;
        cryptoData.usdc = usdcResponse.data;
        cryptoData.sol = solResponse.data;
      } catch (error) {
        console.error('Error en GetPrice:', error);
      }
    };

    watch(selectedCrypto, (value) => {
      transactionData.crypto_code = value;
    });

    watch(enteredAmount, (value) => {
      transactionData.crypto_amount = value;
    });

    onBeforeMount(() => {
      GetPrice();
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${`00${date.getMonth() + 1}`.slice(-2)}-${`00${date.getDate()}`.slice(-2)}T${`00${date.getHours()}`.slice(-2)}:${`00${date.getMinutes()}`.slice(-2)}`;
      transactionData.datetime = formattedDate;
    });

    return {
      user,
      selectedCrypto,
      calculatedPrice,
      transactionSuccess,
      availableFunds,
      enteredAmount,
      cryptoData,
      GetPrice,
      validateKey,
      setAction,
      executeAction,
      transactionData
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

@media screen and (max-width: 768px){
  .inputs{
    display: block !important;
  }
  select, input{
    width: 100%;
  }
}
</style>
