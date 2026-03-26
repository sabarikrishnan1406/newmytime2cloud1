<template>
  <v-row class="pa-3">
    <v-col>
      <v-date-picker
        class="custom-date-picker"
        :class="
          $isDark()
            ? 'accent white--text dark-mode'
            : 'light-background black--text'
        "
        dark
        flat
        v-if="eventsForCurrentMonth"
        hide-details
        full-width
        no-title
        dense
        :events="Object.keys(eventsForCurrentMonth)"
        :event-color="getEventColorsForCurrentMonth"
        v-model="selectedDatesForCurrentMonth"
        :max="maxDateForCurrentMonth"
      >
        <template v-slot:default>
          <table style="width: 100%; table-layout: fixed">
            <tr>
              <td style="width: 20px; min-width: 10px">
                <div
                  class="green"
                  style="
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                  "
                ></div>
              </td>
              <td style="white-space: nowrap">
                <div>
                  <strong style="font-size: 16px">{{
                    eventStatsForCurrentMonth["P"] || 0
                  }}</strong>
                </div>
                <div>Present</div>
              </td>
              <td style="width: 20px; min-width: 10px">
                <div
                  class="red"
                  style="
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                  "
                ></div>
              </td>
              <td style="white-space: nowrap">
                <div>
                  <strong style="font-size: 16px">{{
                    eventStatsForCurrentMonth["A"] || 0
                  }}</strong>
                </div>
                <div>Absent</div>
              </td>
              <td style="width: 20px; min-width: 10px">
                <div
                  class="primary"
                  style="
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                  "
                ></div>
              </td>
              <td style="white-space: nowrap">
                <div>
                  <strong style="font-size: 16px">{{
                    eventStatsForCurrentMonth["O"] || 0
                  }}</strong>
                </div>
                <div>WeekOff</div>
              </td>
              <td style="width: 20px; min-width: 10px">
                <div
                  class="orange"
                  style="
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                  "
                ></div>
              </td>
              <td style="white-space: nowrap">
                <div>
                  <strong style="font-size: 16px">{{
                    eventStatsForCurrentMonth["OTHERS_COUNT"] || 0
                  }}</strong>
                </div>
                <div>Other</div>
              </td>
            </tr>
          </table>
        </template>
      </v-date-picker>
    </v-col>
  </v-row>
</template>
<script>
export default {

  props: ["company_id", "system_user_id", "employee_id"],

  data() {
    return {
      selectedDatesForCurrentMonth: null, // Default to today
      maxDateForCurrentMonth: null,
      eventsForCurrentMonth: null,
      eventStatsForCurrentMonth: null,
    };
  },

  methods: {
    setDataForDatePicker() {
      const date = new Date(); // This is a Date object, not a string
      let currentMonth = new Date(date.getFullYear(), date.getMonth() + 1)
        .toISOString()
        .substr(0, 7);

      this.selectedDatesForCurrentMonth = `${currentMonth}-01`;
      this.maxDateForCurrentMonth = `${currentMonth}-31`;
    },
    getEventColorsForCurrentMonth(e) {
      return this.eventsForCurrentMonth[e] || "";
    },
    async geCurrentMonthPerformanceReport() {
      let url = `current-month-performance-report`;
      let payload = {
        company_id: this.company_id,
        employee_id: this.system_user_id,
      };
      let { data } = await this.$axios.post(url, payload);
      this.eventsForCurrentMonth = data.events;
      this.eventStatsForCurrentMonth = data.stats;
    },
  },

  async mounted() {
    await this.geCurrentMonthPerformanceReport();
  },
};
</script>
