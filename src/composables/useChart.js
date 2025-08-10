import { ref, onMounted, onUnmounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export function useChart(canvasRef) {
  const chart = ref(null);

  function initChart() {
    if (!canvasRef.value) {
      console.warn('Canvas ref not available for chart initialization');
      return;
    }

    // Destroy existing chart if any
    destroyChart();

    const ctx = canvasRef.value.getContext('2d');
    
    chart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Price',
          data: [],
          fill: false,
          tension: 0.25,
          borderColor: '#6ee7b7',
          backgroundColor: '#6ee7b7',
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2
        }]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            ticks: {
              callback: (value) => '$' + value,
              color: '#a6adbb'
            },
            grid: {
              color: '#222b3d'
            }
          }
        },
        elements: {
          point: {
            radius: 0
          }
        }
      }
    });
  }

  function updateChart(priceHistory) {
    if (!chart.value || !priceHistory.length) return;

    const labels = priceHistory.map(point => point.time.toLocaleTimeString());
    const data = priceHistory.map(point => point.price);

    chart.value.data.labels = labels;
    chart.value.data.datasets[0].data = data;

    if (data.length > 1) {
      const minVal = Math.min(...data);
      const maxVal = Math.max(...data);
      const padding = (maxVal - minVal) * 0.05;
      
      chart.value.options.scales.y.min = minVal - padding;
      chart.value.options.scales.y.max = maxVal + padding;
    }

    chart.value.update('none'); // No animation for better performance
  }

  function addDataPoint(timestamp, price) {
    if (!chart.value || !chart.value.data) {
      console.warn('Chart not ready for data update');
      return;
    }

    try {
      chart.value.data.labels.push(timestamp.toLocaleTimeString());
      chart.value.data.datasets[0].data.push(price);

      // Keep only last 300 points
      if (chart.value.data.labels.length > 300) {
        chart.value.data.labels.shift();
        chart.value.data.datasets[0].data.shift();
      }

      const data = chart.value.data.datasets[0].data;
      if (data.length > 1) {
        const minVal = Math.min(...data);
        const maxVal = Math.max(...data);
        const padding = (maxVal - minVal) * 0.05;

        chart.value.options.scales.y.min = minVal - padding;
        chart.value.options.scales.y.max = maxVal + padding;
      }

      chart.value.update('none');
    } catch (error) {
      console.error('Error adding data point to chart:', error);
    }
  }

  function clearChart() {
    if (!chart.value || !chart.value.data) {
      console.warn('Chart not available for clearing');
      return;
    }

    try {
      chart.value.data.labels = [];
      chart.value.data.datasets[0].data = [];
      chart.value.update('none');
    } catch (error) {
      console.error('Error clearing chart:', error);
    }
  }

  function destroyChart() {
    if (chart.value) {
      chart.value.destroy();
      chart.value = null;
    }
  }

  onUnmounted(() => {
    destroyChart();
  });

  return {
    chart,
    initChart,
    updateChart,
    addDataPoint,
    clearChart,
    destroyChart
  };
}
