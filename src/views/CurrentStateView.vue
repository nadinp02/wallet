<template>
  <div>
    <navbar></navbar>
    <div class="container mt-5">
      <div class="row">
        <div class="col-sm-12 col-lg-6">
          <div class="text-center">
            <h3 class="m-3">Your Total Balance: <b>${{ totalAmount.toFixed(2) }}</b></h3>
            <h4 v-for="crypto in cryptocurrencies" :key="crypto.code">
              {{ crypto.name }}: $<b>{{ crypto.money.toFixed(2) }}</b> - Amount: <b>{{ crypto.amount.toFixed(2) }}</b>
            </h4>
          </div>
        </div>
        <div class="col-sm-12 col-lg-6">
          <div class="graphicCard align-items-center">
            <div class="card">
              <div class="card-body">
                <div class="grid-item">
                  <h4 class="text-center">Coins</h4>
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
import { useStore } from 'vuex';
import criptoyaApi from '../services/criptoyaApi';
import laboApi from "@/services/labo";

export default {
  components: {
    navbar,
  },
  setup() {
    const store = useStore();

    const cryptocurrencies = ref([]);
    const totalAmount = ref(0);

    const fetchData = async () => {
      try {
        const transactionsResponse = await laboApi.getHistorial();
        const transactions = transactionsResponse.data;

        const calculatedBTC = transactions
          .filter(t => t.crypto_code === 'btc')
          .reduce((acc, t) => acc + parseFloat(t.crypto_amount), 0);
        const calculatedETH = transactions
          .filter(t => t.crypto_code === 'eth')
          .reduce((acc, t) => acc + parseFloat(t.crypto_amount), 0);
        const calculatedUSDC = transactions
          .filter(t => t.crypto_code === 'usdc')
          .reduce((acc, t) => acc + parseFloat(t.crypto_amount), 0);
        const calculatedSOL = transactions
          .filter(t => t.crypto_code === 'sol')
          .reduce((acc, t) => acc + parseFloat(t.crypto_amount), 0);

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
          { code: 'btc', name: 'Bitcoin', amount: calculatedBTC, money: calculatedBTC * btcPrice },
          { code: 'eth', name: 'Ethereum', amount: calculatedETH, money: calculatedETH * ethPrice },
          { code: 'usdc', name: 'USDC', amount: calculatedUSDC, money: calculatedUSDC * usdcPrice },
          { code: 'sol', name: 'SOL', amount: calculatedSOL, money: calculatedSOL * solPrice },
        ];

        cryptocurrencies.value = calculatedCryptos;

        totalAmount.value = calculatedBTC * btcPrice + calculatedETH * ethPrice + calculatedUSDC * usdcPrice + calculatedSOL * solPrice;
      } catch (error) {
        console.error(error);
      }
    };

    const chartCanvas = ref(null);

    onMounted(async () => {
      await fetchData();

      // Actualizar el estado global con los nuevos valores
      store.commit('setBTC', cryptocurrencies.value.find(crypto => crypto.code === 'btc').amount);
      store.commit('setETH', cryptocurrencies.value.find(crypto => crypto.code === 'eth').amount);
      store.commit('setUSDC', cryptocurrencies.value.find(crypto => crypto.code === 'usdc').amount);
      store.commit('setSOL', cryptocurrencies.value.find(crypto => crypto.code === 'sol').amount);
      store.commit('setAvailableFunds', totalAmount.value);

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
                const moneyValue = crypto && crypto.money !== undefined ? `$${crypto.money.toFixed(2)}` : '$0.00';
                const amountValue = crypto && crypto.amount !== undefined ? crypto.amount.toFixed(2) : '0.00';
                return `${label}: ${moneyValue} - Amount: ${amountValue}`;
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
      totalAmount,
    };
  },
};
</script>

<style scoped>

</style>

