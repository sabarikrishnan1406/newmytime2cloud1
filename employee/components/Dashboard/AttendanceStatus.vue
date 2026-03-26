<template>
  <v-row class="pa-3">
    <v-col>
      <v-sheet color="transparent" class="px-5">
        <apexchart :key="chartKey"
          type="donut"
          height="200"
          :options="donutChartOptions"
          :series="series"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
export default {

  props: ["company_id", "system_user_id", "employee_id"],

  data() {
    return {
      series: [0, 0, 0],
      donutChartOptions: {
        legend: {
          position: "bottom",
          labels: {
            colors: "#ffffff",
          },
        },
        labels: ["Present", "Leave", "Absent"],
        colors: ["#00E396", "#FEB019", "#FF0000"],
        dataLabels: { enabled: false },
        plotOptions: {
          pie: {
            donut: {
              size: "90%",
            },
          },
        },
        stroke: {
          show: false,
        },
      },
      chartKey: 1,
    };
  },

  computed: {
    isDark() {
      return this.$isDark();
    },
  },

  watch: {
    isDark(newVal) {
      this.updateChartColors();
    },
  },

  methods: {
    updateChartColors() {
      const color = this.isDark ? "#ffffff" : "#000000";
      this.donutChartOptions.legend.labels.colors = color;
      this.chartKey++; // Trigger re-render if needed
    },
  },

  async mounted() {
    try {
      const { data } = await this.$axios.post(`current-month-performance-report`, {
        company_id: this.company_id,
        employee_id: this.system_user_id,
      });
      const statusses = data.stats;
      this.series = [statusses["P"], statusses["L"], statusses["A"]];
    } catch (error) {
      console.error("Failed to load attendance summary:", error);
    }

    this.updateChartColors(); // Initial set
  },
};
</script>
