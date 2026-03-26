<template>
  <span>
    <style scoped>
      .chartBox {
        margin: 0 auto;
        width: 300px;
        padding: 20px;
        border-radius: 20px;
        position: relative;
      }
      #temperature {
        color: #fff;
        position: absolute;
        top: 250px;
        font-size: 35px;
        left: 90px;
      }
    </style>
    <div class="chartBox text-center">
      <canvas id="myChart" width="300" height="300"></canvas>
      <div id="temperature"></div>
    </div>
  </span>
</template>

<script>
export default {
  props: {
    temperature: {
      type: Number,
      default: 18.2,
    },
  },
  data() {
    return {
      currentValue: 0,
      chart: null,
    };
  },
  mounted() {
    if (!window.Chart) {
      const script = document.createElement("script");
      script.src = "/scripts/chart.js";
      script.onload = this.initChart;
      document.head.appendChild(script);
    } else {
      this.initChart();
    }
  },
  methods: {
    initChart() {
      const ctx = document.getElementById("myChart").getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 300, 0);
      gradient.addColorStop(0, "green");
      gradient.addColorStop(0.5, "yellow");
      gradient.addColorStop(1, "red");

      const gaugeNeedle = {
        id: "gaugeNeedle",
        afterDraw: (chart) => {
          const {
            ctx,
            chartArea: { width },
          } = chart;
          const cx = width / 2;
          const cy = 220;
          const needleLength = 150;
          const needleWidth = 25;
          const radius = needleWidth / 2;
          const angle = Math.PI + (this.currentValue / 100) * Math.PI;

          const tipX = cx + Math.cos(angle) * needleLength;
          const tipY = cy + Math.sin(angle) * needleLength;

          const baseX = cx;
          const baseY = cy;

          const perpAngle1 = angle + Math.PI / 2;
          const perpAngle2 = angle - Math.PI / 2;

          const baseX1 = baseX + Math.cos(perpAngle1) * radius;
          const baseY1 = baseY + Math.sin(perpAngle1) * radius;
          const baseX2 = baseX + Math.cos(perpAngle2) * radius;
          const baseY2 = baseY + Math.sin(perpAngle2) * radius;

          ctx.save();
          ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
          ctx.shadowBlur = 5;

          ctx.beginPath();
          ctx.moveTo(baseX1, baseY1);
          ctx.arc(baseX, baseY, radius, perpAngle1, perpAngle2, false);
          ctx.lineTo(tipX, tipY);
          ctx.closePath();
          ctx.fillStyle = "#03c3ec";
          ctx.fill();

          ctx.beginPath();
          ctx.shadowBlur = 0;
          ctx.arc(cx, cy, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        },
      };

      const data = {
        labels: ["Low", "Medium", "High", ""],
        datasets: [
          {
            data: [100],
            backgroundColor: [gradient],
            borderWidth: 0,
            cutout: "80%",
            circumference: 270,
            rotation: 225,
          },
        ],
      };

      const config = {
        type: "doughnut",
        data,
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
        },
        plugins: [gaugeNeedle],
      };

      this.chart = new window.Chart(ctx, config);
      this.animateNeedle(this.temperature);
      this.counterUp(this.temperature);
    },

    animateNeedle(target) {
      const speed = 2;
      const animate = () => {
        const diff = target - this.currentValue;
        if (Math.abs(diff) < 0.1) {
          this.currentValue = target;
          this.chart.update();
          return;
        }
        this.currentValue += diff / speed;
        this.chart.update();
        requestAnimationFrame(animate);
      };
      animate();
    },

    counterUp(target, duration = 1000, steps = 30) {
      const element = document.getElementById("temperature");
      let current = 0;
      const increment = target / steps;
      const interval = duration / steps;

      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.innerHTML = `${target.toFixed(2)} <small>C</small>`;
          clearInterval(counter);
        } else {
          const value =
            target < 10
              ? "00.00"
              : (Math.round(current * 100) / 100).toFixed(2);
          element.innerHTML = `${value} <small>C</small>`;
        }
      }, interval);
    },
  },
};
</script>
