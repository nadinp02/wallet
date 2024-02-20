<template>
  <div>
    <navbar></navbar>
    <div class="container">
      <h3 class="mt-5 mb-3">Investment Analysis</h3>
      <table class="table table-bordered table-hover">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Cryptocurrency</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="crypto in cryptocurrencies" :key="crypto.code">
            <td>{{ crypto.code.toUpperCase() }}</td>
            <td
              :class="{
                'text-success': crypto.result >= 0,
                'text-danger': crypto.result < 0,
              }"
            >
              {{ crypto.result.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import navbar from "../components/NavBar.vue";
import criptoyaApi from "@/services/criptoyaApi";
import laboApi from "@/services/labo";
import { ref, onMounted } from "vue";

export default {
  components: {
    navbar,
  },
  setup() {
    const cryptocurrencies = ref([]);
    const fetchInvestmentResults = async () => {
      try {
        const transactionsResponse = await laboApi.getHistorial();
        const transactions = transactionsResponse.data;
        // console.log(transactions);
        const [btcPriceResponse,ethPriceResponse,usdcPriceResponse,solPriceResponse,] = await Promise.all([
          criptoyaApi.getBTC(),
          criptoyaApi.getETH(),
          criptoyaApi.getUSDC(),
          criptoyaApi.getSOL(),
        ]);

        const calculatedResults = {};

        transactions.forEach((transaction) => {
          if (!calculatedResults[transaction.crypto_code]) {
            calculatedResults[transaction.crypto_code] = {
              totalAmount: 0,
              totalPurchaseMoney: 0,
              totalSaleMoney: 0,
              hasSale: false,
            };
          }

          if (transaction.action === "purchase") {
            calculatedResults[transaction.crypto_code].totalAmount += parseFloat(
              transaction.crypto_amount
            );
            calculatedResults[transaction.crypto_code].totalPurchaseMoney += parseFloat(
              transaction.money
            );
          } else if (transaction.action === "sale") {
            calculatedResults[transaction.crypto_code].hasSale = true;
            calculatedResults[transaction.crypto_code].totalSaleMoney += parseFloat(
              transaction.money
            );
          }
        });

        //nuevo arreglo de objetos con los resultados finales
        const calculatedCryptos = Object.keys(calculatedResults).map((cryptoCode) => {
          const {totalAmount,totalPurchaseMoney,totalSaleMoney,hasSale,} = calculatedResults[cryptoCode];
          let currentPrice = 0;
          switch (cryptoCode) {
            case "btc":
              currentPrice = btcPriceResponse.data.ask;
              break;
            case "eth":
              currentPrice = ethPriceResponse.data.ask;
              break;
            case "usdc":
              currentPrice = usdcPriceResponse.data.ask;
              break;
            case "sol":
              currentPrice = solPriceResponse.data.ask;
              break;
            default:
              break;
          }

          let result = 0;
          if (hasSale) {
            result = totalSaleMoney - totalPurchaseMoney;
          } else {
            result = (currentPrice * totalAmount) - totalPurchaseMoney;
          }

          return {
            code: cryptoCode,
            result: result,
          };
        });

        cryptocurrencies.value = calculatedCryptos;
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      fetchInvestmentResults();
    });

    return {
      cryptocurrencies,
    };
  },
};
</script>

<style scoped>
</style>
