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
            <td>{{ crypto.name }}</td>
            <td :class="{ 'text-success': crypto.result >= 0, 'text-danger': crypto.result < 0 }">
              {{ crypto.result.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import navbar from '../components/NavBar.vue';
import criptoyaApi from "@/services/criptoyaApi";
import laboApi from "@/services/labo";
import { ref, onMounted } from 'vue';

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

        const [btcPriceResponse, ethPriceResponse, usdcPriceResponse, solPriceResponse] = await Promise.all([
          criptoyaApi.getBTC(),
          criptoyaApi.getETH(),
          criptoyaApi.getUSDC(),
          criptoyaApi.getSOL(),
        ]);

        const btcPrice = btcPriceResponse.data.ask;
        const ethPrice = ethPriceResponse.data.ask;
        const usdcPrice = usdcPriceResponse.data.ask;
        const solPrice = solPriceResponse.data.ask;

        const calculatedCryptos = transactions.map(transaction => {
          const moneySpent = parseFloat(transaction.money);
          const amount = parseFloat(transaction.crypto_amount);

          const currentPrice = getCurrentPrice(transaction.crypto_code, btcPrice, ethPrice, usdcPrice, solPrice);

          const result = transaction.action === 'purchase'
            ? currentPrice * amount - moneySpent
            : moneySpent - currentPrice * amount;

          return {
            code: transaction.crypto_code,
            name: getCryptoName(transaction.crypto_code),
            result,
          };
        });

        cryptocurrencies.value = calculatedCryptos;

      } catch (error) {
        console.error(error);
      }
    };

    const getCurrentPrice = (cryptoCode, btcPrice, ethPrice, usdcPrice, solPrice) => {
      switch (cryptoCode) {
        case 'btc':
          return btcPrice;
        case 'eth':
          return ethPrice;
        case 'usdc':
          return usdcPrice;
        case 'sol':
          return solPrice;
        default:
          return 0;
      }
    };

    const getCryptoName = (cryptoCode) => {
      switch (cryptoCode) {
        case 'btc':
          return 'Bitcoin';
        case 'eth':
          return 'Ethereum';
        case 'usdc':
          return 'USDC';
        case 'sol':
          return 'SOL';
        default:
          return '';
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
