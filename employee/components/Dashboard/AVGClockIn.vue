<template>
  <v-row class="pa-3">
    <v-col cols="12">
      <div class="text-center">
        <div class="text-h5">Avg Clock In</div>
        <div>{{ avg_clock_in }}</div>
      </div>
      <div v-if="chartSeries[0].data">
        <apexchart
          type="line"
          height="150"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["company_id", "system_user_id", "employee_id", "shift_type_id"],

  data() {
    return {
      loading:true,
      avg_clock_in: "00:00",
      chartSeries: [
        {
          name: "Clock In Time",
          data: [], // this way working
        },
      ],
      chartOptions: {
        chart: {
          id: "clockInLineChart",
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 1000,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        xaxis: {
          categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          labels: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        grid: {
          show: false,
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        markers: {
          size: 4,
        },
        colors: ["#6946dd"],
        tooltip: {
          enabled: true,
          y: {
            formatter: function (value) {
              const hours = Math.floor(value / 60);
              const minutes = value % 60;
              return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}`;
            },
          },
        },
      },
    };
  },
  async mounted() {

    try {
      const response = await this.$axios.$get(
        `/employee-avg-clock-in?company_id=${this.company_id}&employee_id=${this.system_user_id}`
      );
      this.avg_clock_in = response.avg_clock_in;

      let data = response.last_week_clock_ins;

      this.chartSeries = [
        {
          name: "Clock In Time",
          data: data.map((e) => e.value),
        },
      ];

      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          categories: data.map((e) => e.date),
        },
      };

      this.loading = false;
    } catch (error) {
      console.error("Failed to load attendance summary:", error);
    }
  },
};
</script>
