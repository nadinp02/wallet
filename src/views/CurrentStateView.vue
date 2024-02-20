<template>
  <div>
    <navbar></navbar>
    <div class="container mt-5">
      <div class="row">
        <div class="col-sm-12 col-lg-6">
          <div class="text-center">
            <h3 class="m-3"> Current Funds: <strong>${{ parseFloat(availableFunds).toFixed(2) }}</strong></h3>
            <h4 v-for="crypto in cryptocurrencies" :key="crypto.code">
              {{ crypto.name }}: <b>${{ crypto.money.toFixed(2) }}</b> - Amount: <b>{{ crypto.amount }}</b>
            </h4>
          </div>
        </div>
        <div class="col-sm-12 col-lg-6">
          <div class="graphicCard align-items-center">
            <div class="card">
              <div class="card-body">
                <div class="grid-item">
                  <h4 class="text-center">Cryptocurrencies</h4>
                  <div>
                    <canvas ref="chartCanvas" id="barChart" class="w-100 h-100"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import navbar from "@/components/NavBar.vue";
import Chart from 'chart.js/auto';
import store from "@/store/index";
import criptoyaApi from '@/services/criptoyaApi';
import laboApi from "@/services/labo";

export default {
  components: {
    navbar,
  },
  setup() {
    const availableFunds = store.state.availableFunds;
    const cryptocurrencies = ref([]);

    const fetchData = async () => {
      try {
        const transactionsResponse = await laboApi.getHistorial();
        const transactions = transactionsResponse.data;
        const cryptoAmounts = {
          btc: 0,
          eth: 0,
          usdc: 0,
          sol: 0,
        };

        transactions.forEach(transaction => {
          if (transaction.action === 'purchase') {
            cryptoAmounts[transaction.crypto_code] += parseFloat(transaction.crypto_amount);
          } else if (transaction.action === 'sale') {
            cryptoAmounts[transaction.crypto_code] -= parseFloat(transaction.crypto_amount);
          }
        });

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

        const calculatedCryptos = [
          { code: 'btc', name: 'Bitcoin', amount: cryptoAmounts['btc'], money: cryptoAmounts['btc'] * btcPrice },
          { code: 'eth', name: 'Ethereum', amount: cryptoAmounts['eth'], money: cryptoAmounts['eth'] * ethPrice },
          { code: 'usdc', name: 'USDC', amount: cryptoAmounts['usdc'], money: cryptoAmounts['usdc'] * usdcPrice },
          { code: 'sol', name: 'SOL', amount: cryptoAmounts['sol'], money: cryptoAmounts['sol'] * solPrice },
        ];

        cryptocurrencies.value = calculatedCryptos;
      } catch (error) {
        console.error(error);
      }
    };

    const chartCanvas = ref(null);

    onMounted(async () => {
      await fetchData();
      const ctx = chartCanvas.value ? chartCanvas.value.getContext('2d') : null;
      new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cryptocurrencies.value.map(crypto => crypto.name),
        datasets: [
          {
            label: 'Money',
            backgroundColor: ['rgba(255, 220, 0, 0.8)', 'rgba(255, 98, 247, 0.8)', 'rgba(0, 130, 255, 0.8)', 'rgba(0, 255, 0, 0.8)'],
            borderColor: ['rgba(255, 220, 0, 1)', 'rgba(255, 98, 247, 1)', 'rgba(0, 130, 255, 1)', 'rgba(0, 255, 0, 1)'],
            borderWidth: 1,
            data: cryptocurrencies.value.map(crypto => crypto.money || 0),
          },
          {
            label: 'Amount',
            backgroundColor: ['rgba(255, 220, 0, 0.2)', 'rgba(255, 98, 247, 0.2)', 'rgba(0, 130, 255, 0.2)', 'rgba(0, 255, 0, 0.2)'],
            borderColor: ['rgba(255, 220, 0, 0.5)', 'rgba(255, 98, 247, 0.5)', 'rgba(0, 130, 255, 0.5)', 'rgba(0, 255, 0, 0.5)'],
            borderWidth: 1,
            data: cryptocurrencies.value.map(crypto => crypto.amount || 0),
          },
        ],
      },
      options: {
        scales: {
          y: {
            type: 'logarithmic',
            beginAtZero: true,
          },
        },
        maintainAspectRatio: false,
        plugins: {
          legend: {
           display: false,
          },
        tooltip: {
          callbacks: {
            label: function(context) {
              const crypto = cryptocurrencies.value[context.dataIndex];
              const label = context.datasetIndex === 0 ? 'Money' : 'Amount';
              const value = context.datasetIndex === 0 ? crypto.money : crypto.amount;
              const formattedValue = value !== undefined ? `$${value}` : '$0.00';
              return `${label}: ${formattedValue}`;
            },
          },

        },
        },
      },
    });
  });

    return {
      chartCanvas,
      cryptocurrencies,
      availableFunds,
    };
  },
};
</script>

<style scoped>

</style>

