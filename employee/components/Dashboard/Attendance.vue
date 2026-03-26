<template>
  <v-row class="pa-3">
    <v-col>
      <style scoped>
        .apexcharts-tooltip {
          background-color: #f4f4f4 !important;
          color: #000000 !important;
          border-radius: 6px !important;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
      </style>

      <v-row v-if="attendanceStats" justify="space-between" align="center">
        <v-col cols="12" class="px-10">
          <div
            class="text-h5"
            :class="isDarkMode ? 'white--text' : 'black--text'"
          >
            OverAll Attendance
          </div>
        </v-col>

        <v-col cols="4" class="text-center">
          <div class="caption mt-1">
            <v-icon size="20" color="success">mdi-check</v-icon>
            <span :class="isDarkMode ? 'white--text' : 'black--text'">
              Present
            </span>
          </div>
          <div class="text-h6 font-weight-bold">
            <v-progress-circular
              :size="20"
              :value="attendanceStats['P']"
              color="success"
            ></v-progress-circular>
            <span :class="isDarkMode ? 'white--text' : 'black--text'">
              {{ attendanceStats["P"] }}
            </span>
          </div>
        </v-col>

        <v-col cols="4" class="text-center">
          <div class="caption mt-1">
            <v-icon size="20" color="orange">mdi-calendar</v-icon>
            <span :class="isDarkMode ? 'white--text' : 'black--text'">
              Leave
            </span>
          </div>
          <div class="text-h6 font-weight-bold">
            <v-progress-circular
              :size="20"
              :value="attendanceStats['L']"
              color="orange"
            ></v-progress-circular>
            <span :class="isDarkMode ? 'white--text' : 'black--text'">
              {{ attendanceStats["L"] }}
            </span>
          </div>
        </v-col>

        <v-col cols="4" class="text-center">
          <div class="caption mt-1">
            <v-icon size="20" color="red">mdi-close</v-icon>
            <span :class="isDarkMode ? 'white--text' : 'black--text'">
              Absent
            </span>
          </div>
          <div class="text-h6 font-weight-bold">
            <v-progress-circular
              :size="20"
              :value="attendanceStats['A']"
              color="red"
            ></v-progress-circular>
            <span :class="isDarkMode ? 'white--text' : 'black--text'">
              {{ attendanceStats["A"] }}
            </span>
          </div>
        </v-col>
      </v-row>

      <v-container fluid class="pa-5">
        <apexchart
          :key="chartKey"
          v-if="!loading"
          type="bar"
          height="280"
          :options="barChartOptions"
          :series="barChartSeries"
          style="width: 100%"
        />
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ["company_id", "system_user_id", "employee_id"],
  data() {
    return {
      attendanceStats: [],
      attendances: [],
      barChartSeries: [],
      loading: true,
      chartKey: 1,
      barChartOptions: {
        chart: {
          type: "bar",
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            columnWidth: "15%",
            borderRadius: 0,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: "#000000", // default light mode
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#000000", // default light mode
              fontSize: "12px",
            },
          },
        },
        colors: ["#6946dd"],
      },
    };
  },

  computed: {
    isDarkMode() {
      return this.$isDark();
    },
  },

  watch: {
    isDarkMode() {
      this.updateChartColors();
    },
  },

  methods: {
    updateChartColors() {
      const color = this.isDarkMode ? "#ffffff" : "#000000";
      this.barChartOptions.xaxis.labels.style.colors = color;
      this.barChartOptions.yaxis.labels.style.colors = color;
      this.chartKey++; // force re-render
    },
  },

  async mounted() {
    let company_id = this.company_id;
    let system_user_id = this.system_user_id;
    let employee_id = this.employee_id;
    try {
      const response = await this.$axios.$get(
        `/employee-attendance-summary?company_id=${company_id}&employee_id=${system_user_id}`
      );
      this.attendances = response.attendances;
      this.barChartSeries = response.barChartSeries;
      this.barChartOptions.xaxis.categories = response.labels;

      this.updateChartColors();
      this.loading = false;
    } catch (error) {
      console.error("Failed to load attendance summary:", error);
    }

    let url = `current-month-performance-report`;
    let payload = {
      company_id,
      employee_id: system_user_id,
    };
    let { data } = await this.$axios.post(url, payload);
    this.attendanceStats = data.stats;
  },
};
</script>
