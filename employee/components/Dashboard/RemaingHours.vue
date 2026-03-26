<template>
  <v-row class="pa-3">
    <v-col cols="12">
      <div class="text-center mt-2">Today Remaing Hours</div>
      <apexchart
        :key="key"
        type="radialBar"
        :options="gaugeOptions"
        :series="gaugeSeries"
      ></apexchart>
    </v-col>
  </v-row>
</template>
<script>
export default {

  props: ["company_id", "system_user_id"],
  
  data() {
    return {
      key: 1,
      gaugeOptions: {
        chart: {
          height: 350,
          type: "radialBar",
          offsetY: -10,
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
              show: false, // Remove percentage from the bar itself.  We'll display it below.
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91],
          },
        },
        colors: ["#9c27b0"], // purple

        stroke: {
          dashArray: 4,
        },
      },
      gaugeSeries: [100],
      _gaugeInterval: null,
    };
  },

  computed: {
    isDarkMode() {
      return this.$isDark();
    },
  },

  watch: {
    isDarkMode() {},
  },
  beforeDestroy() {
    if (this._gaugeInterval) {
      clearInterval(this._gaugeInterval);
      this._gaugeInterval = null;
    }
  },
  methods: {
    async getTodayAttendance() {
      try {
        const { data } = await this.$axios.get(`report`, {
          params: {
            company_id: this.company_id,
            employee_id: this.system_user_id,
            from_date: this.getFormattedDate(),
            to_date: this.getFormattedDate(),
          },
        });

        const attendanceData = data.data;

        if (!attendanceData.length) {
          this.calculateLateAndRemaining("00:00", "00:00", "00:00");
          this.gaugeSeries = [100]; // Show 100% idle if no data
          return;
        }

        const { shift } = attendanceData[0];

        const updateGauge = () => {
          const remainingPercent = this.calculateLateAndRemaining(
            this.timeHandler(shift.on_duty_time),
            this.timeHandler(shift.off_duty_time),
            this.timeHandler(this.getCurrentHour())
          );
          this.gaugeSeries = [100 - remainingPercent];
          this.key++;
        };

        // Initial update
        updateGauge();

        // Clear any previous interval if exists
        if (this._gaugeInterval) {
          clearInterval(this._gaugeInterval);
        }

        // Update every 3 seconds
        this._gaugeInterval = setInterval(updateGauge, 5000);
      } catch (error) {
        console.error("Failed to get attendance report:", error);
        // Optionally, show error to user
      }
    },
    getCurrentHour() {
      // Get current time in HH:MM format
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    calculateLateAndRemaining(shiftStart, shiftEnd, punchIn) {
      const today = new Date().toISOString().slice(0, 10); // e.g., '2025-05-14'

      const start = new Date(`${today}T${shiftStart}:00`);
      let end = new Date(`${today}T${shiftEnd}:00`);
      const punch = new Date(`${today}T${punchIn}:00`);

      // Handle overnight shift (e.g., start: 20:00, end: 07:00 next day)
      if (end <= start) {
        end.setDate(end.getDate() + 1); // move end to next day
      }

      const totalShiftMinutes = (end - start) / 60000;
      const lateMinutes = Math.max(0, (punch - start) / 60000);
      const remainingMinutes = Math.max(0, (end - punch) / 60000);

      return (remainingMinutes / totalShiftMinutes) * 100;

      return {
        latePercent: (lateMinutes / totalShiftMinutes) * 100,
        remainingPercent: (remainingMinutes / totalShiftMinutes) * 100,
      };
    },
    timeHandler(value) {
      return value === "---" ? "00:00" : value;
    },
    getFormattedDate() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")}`;
    },
  },

  async mounted() {
    try {
      await this.getTodayAttendance();
      this.loading = false;
    } catch (error) {
      console.error("Failed to load attendance summary:", error);
    }
  },
};
</script>
