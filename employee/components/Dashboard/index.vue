<template>
  <client-only>
    <v-container>
      <style scoped>
        /* Hide the selected date highlight */
        .v-date-picker-table .v-btn--active {
          background: white !important;
          color: black !important;
        }

        .v-date-picker-table .v-btn--active::before {
          opacity: 0 !important;
        }
      </style>
      <v-row no-gutters class="pa-2" id="screenshot-element">
        <v-col style="margin-right: 10px">
          <v-row no-gutters>
            <v-col cols="12" style="margin-top: 10px">
              <v-card elevation="3" style="border-radius: 5px">
                <v-alert dense flat dark class="primary">Profile</v-alert>
                <v-card-text style="color: black">
                  <v-row>
                    <v-col cols="5">
                      <div class="d-flex align-start">
                        <v-avatar size="60">
                          <img
                            v-if="base64Image"
                            ref="profileImage"
                            :src="base64Image"
                            alt="Profile"
                          />
                        </v-avatar>
                        <div class="ml-5">
                          <div
                            class="primary--text body-1 py-0"
                            style="
                              max-width: 150px;
                              white-space: nowrap;
                              overflow: hidden;
                              text-overflow: ellipsis;
                            "
                          >
                            <b> {{ employee?.name }}</b>
                          </div>

                          <div style="margin-top: 3px">
                            ID: {{ employee?.employee_id }}
                          </div>
                          <div style="margin-top: 3px">
                            {{ employee?.designation || "---" }}
                          </div>
                          <div style="margin-top: 3px">
                            {{ employee?.branch || "---" }}
                          </div>
                          <div style="margin-top: 3px">
                            {{ employee?.company }}
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <div class="text-left">
                        <div class="white--text">sdf</div>
                        <div style="margin-top: 3px">
                          Email:{{ employee?.email || "---" }}
                        </div>
                        <div style="margin-top: 3px">
                          Ph:
                          {{ employee?.whatsapp_number }}
                        </div>
                        <div style="margin-top: 3px">
                          Nationality:
                          {{ employee?.home_country || "---" }}
                        </div>
                        <div style="margin-top: 3px">
                          Manager:
                          {{ employee?.reporting_manager }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="3" class="text-center">
                      <div class="body-2">
                        <v-rating
                          dense
                          hide-details
                          :value="item.rating"
                          background-color="green lighten-3"
                          color="green"
                          half-increments
                        ></v-rating>
                      </div>
                      <div class="white--text body-2">hideme</div>
                      <div>
                        <strong>Since</strong>
                        <h4 class="text-center text-primary">
                          {{ employee?.joining_date }}
                        </h4>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" style="margin-top: 10px">
              <v-card elevation="3" style="border-radius: 5px">
                <v-alert dense flat dark class="primary"
                  >Overall Performance</v-alert
                >
                <v-card-text>
                  <div style="display: flex">
                    <div style="min-width: 340px" class="body-2 text-left">
                      <b>Last Month</b>
                    </div>
                    <div class="body-2 text-left ml-15">
                      <b>Last 6 Month</b>
                    </div>
                  </div>
                  <div
                    class="mt-1"
                    style="display: flex; align-items: center; height: 30vh"
                  >
                    <div style="flex: 0.7; min-width: 10%">
                      <table style="width: 100%; table-layout: fixed">
                        <tr>
                          <td style="width: 20px; min-width: 10px">
                            <div
                              class="success"
                              style="
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                display: inline-block;
                              "
                            ></div>
                          </td>
                          <td style="white-space: nowrap">
                            <div class="pt-3">
                              <strong style="font-size: 16px">{{
                                item?.p_count
                              }}</strong>
                            </div>
                            <div>Present</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div
                              class="error"
                              style="
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                display: inline-block;
                              "
                            ></div>
                          </td>
                          <td>
                            <div class="pt-3">
                              <strong style="font-size: 16px">{{
                                item?.a_count
                              }}</strong>
                            </div>
                            <div>Absent</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
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
                          <td>
                            <div class="pt-3">
                              <strong style="font-size: 16px">{{
                                item?.o_count
                              }}</strong>
                            </div>
                            <div>WeekOff</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
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
                          <td>
                            <div class="pt-3">
                              <strong style="font-size: 16px">{{
                                item?.other_count
                              }}</strong>
                            </div>
                            <div>Other</div>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Pie Chart -->
                    <div style="flex: 0.7; min-width: 30%">
                      <apexchart
                        with="300px"
                        v-if="isMounted"
                        type="pie"
                        :options="pieOptions"
                        :series="pieSeries"
                      ></apexchart>
                    </div>

                    <!-- Bar Chart (More Space) -->
                    <div style="flex: 0.7; min-width: 60%">
                      <apexchart
                        v-if="
                          isMounted && barOptions?.xaxis?.categories?.length
                        "
                        type="bar"
                        height="200px"
                        :options="barOptions"
                        :series="barSeries"
                      ></apexchart>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" style="margin-top: 10px">
              <v-card elevation="3" style="border-radius: 5px">
                <v-alert dense flat dark class="primary"
                  >Attendance Logs</v-alert
                >
                <v-card-text>
                  <Logs />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4" style="margin-top: 10px">
          <v-row>
            <v-col cols="12">
              <v-card elevation="3" style="border-radius: 5px">
                <v-alert dense flat dark class="primary">Attendance</v-alert>
                <v-card-text>
                  <v-date-picker
                    hide-details
                    v-if="selectedDatesForCurrentMonth"
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
                            <div class="pt-3">
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
                            <div class="pt-3">
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
                            <div class="pt-3">
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
                            <div class="pt-3">
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
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card elevation="3" style="border-radius: 5px">
                <v-alert dense flat dark class="primary">Announcements</v-alert>
                <v-card-text>
                  <Announcement />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </client-only>
</template>

<script>
export default {
  props: ["item", "employee"],
  data() {
    return {
      rating: 4.5,
      selectedDate: null, // Default to today
      maxDate: null,
      events: null,
      eventStats: null,

      selectedDatesForCurrentMonth: null, // Default to today
      maxDateForCurrentMonth: null,
      eventsForCurrentMonth: null,
      eventStatsForCurrentMonth: null,

      dialog: false,
      isMounted: false,
      pieSeries: [86, 5, 6],
      pieOptions: {
        labels: ["Present", "Absent", "WeekOff", "Others"],
        colors: ["#00e676", "#dd2c00", "#6946dd", "#ff9800"],
        legend: { show: false }, // Hide the legends
        dataLabels: { enabled: false },
      },
      barSeries: [
        { name: "Present", data: [] },
        { name: "Absent", data: [] },
        { name: "WeekOff", data: [] },
        { name: "Others", data: [] },
      ],
      barOptions: {
        chart: {
          type: "bar",
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        xaxis: { categories: [] },
        colors: ["#00e676", "#dd2c00", "#6946dd", "#ff9800"],
        legend: { show: true }, // Hide the legends
        plotOptions: {
          bar: {
            columnWidth: "35%", // Increase bar thickness
          },
        },
        dataLabels: {
          enabled: false,
        },
      },

      donutSeries: [0, 0, 0], // Total Salary, Overtime, Deductions
      chartOptionsDonut: {
        chart: {
          type: "donut",
        },
        labels: ["Salary", "Overtime", "Deductions"], // Labels for the donut chart
        colors: ["#4CAF50", "#00e676", "#FFA500"], // Green for Salary, Orange for Overtime, Red for Deductions
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        legend: {
          show: false, // Hides the legend
        },
        dataLabels: {
          enabled: false, // Hides data labels on the chart
        },
        plotOptions: {
          pie: {
            donut: {
              size: "50%", // Reduces the depth (inner radius) of the donut
              labels: {
                show: false, // Hides all labels inside the donut
                total: {
                  show: false, // Hides the total payroll label and value
                },
              },
            },
          },
        },
      },

      leaveChartOptions: {
        chart: {
          type: "bar", // Change the chart type to bar
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false, // Keep the bars vertical
            columnWidth: "50%", // Adjust the width of the bars if needed
          },
        },
        xaxis: {
          categories: [],
        },
        colors: ["#4CAF50"], // Green color for the bar
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: false, // Hides data labels on the chart
        },
      },
      leaveChartSeries: [
        {
          name: "Current Year",
          type: "bar", // Set the type to bar for the current year
          data: [], // Current year's data
        },
      ],
      leaveCardDisplay: null,

      payslipsData: [],
      hoursReportData: null,
      base64Image: null,
      leaveQuota: null,
    };
  },
  async mounted() {
    await this.getLastSixMonthReport({
      company_id: this.$auth.user.company_id,
      employee_id: this.$auth.user.employee.system_user_id,
    });

    await this.getPreviousMonthPerformanceReport({
      company_id: this.$auth.user.company_id,
      employee_id: this.$auth.user.employee.system_user_id,
    });

    await this.geCurrentMonthPerformanceReport({
      company_id: this.$auth.user.company_id,
      employee_id: this.$auth.user.employee.system_user_id,
    });

    await this.getCurrentMonthHoursReport({
      company_id: this.$auth.user.company_id,
      employee_id: this.$auth.user.employee.system_user_id,
    });

    await this.getLastSixMonthSalaryReport({
      company_id: this.$auth.user.company_id,
      employee_id: this.$auth.user.employee.system_user_id,
    });

    await this.getEncodedImage(this.$auth?.user?.employee?.profile_picture);

    await this.getLeaveQuota();

    await this.getYearlyLeaveQuota();

    this.pieSeries = [
      parseInt(this.item?.p_count),
      parseInt(this.item?.a_count),
      parseInt(this.item?.o_count),
      parseInt(this.item?.other_count),
    ];

    this.isMounted = true;

    this.setDataForDatePicker();
  },

  methods: {
    async getLastSixMonthReport(payload) {
      let endpoint = `last-six-month-performance-report`;

      let { data } = await this.$axios.post(endpoint, payload);

      const categories = data.map((e) => e.month_year);
      const presentData = data.map((e) => e.present_count);
      const absentData = data.map((e) => e.absent_count);
      const WeekOffData = data.map((e) => e.week_off_count);
      const otherData = data.map((e) => e.other_count);

      this.barOptions.xaxis.categories = categories;
      this.barSeries = [
        { name: "Present", data: presentData },
        { name: "Absent", data: absentData },
        { name: "WeekOff", data: WeekOffData },
        { name: "Others", data: otherData },
      ];
    },
    async getPreviousMonthPerformanceReport(payload) {
      let { data } = await this.$axios.post(
        `previous-month-performance-report`,
        payload
      );
      this.events = data.events;
      this.eventStats = data.stats;
    },

    async geCurrentMonthPerformanceReport(payload) {
      let { data } = await this.$axios.post(
        `current-month-performance-report`,
        payload
      );
      this.eventsForCurrentMonth = data.events;
      this.eventStatsForCurrentMonth = data.stats;
    },

    async getEncodedImage(url) {
      try {
        let { data } = await this.$axios.get(
          `/get-encoded-profile-picture/?url=${url}`
        );
        this.base64Image = data;
      } catch (error) {
        this.base64Image = null;
      }
    },
    async getCurrentMonthHoursReport(payload) {
      let endpoint = "last-six-month-hours-report";

      let { data } = await this.$axios.post(endpoint, payload);

      this.hoursReportData = data;
    },
    async getLastSixMonthSalaryReport(payload) {
      let endpoint = "last-six-month-salary-report";

      let { data } = await this.$axios.post(endpoint, payload);

      this.payslipsData = data;
    },

    async getLeaveQuota() {
      if (!this.item.leave_group_id) {
        return false;
      }

      let options = {
        params: {
          company_id: this.item.company_id,
          employee_id: this.employee.employee_id_for_leave,
        },
      };

      this.$axios
        .get("leave_total_quota/" + this.item.leave_group_id, options)
        .then(({ data }) => {
          this.leaveQuota = data;
        });
    },
    async getYearlyLeaveQuota() {
      if (!this.item.leave_group_id) {
        return false;
      }

      let options = {
        params: {
          company_id: this.item.company_id,
          employee_id: this.employee.employee_id_for_leave,
        },
      };

      this.$axios
        .get("yearly_leave_quota/" + this.item.leave_group_id, options)
        .then(({ data }) => {
          console.log("🚀 ~ .then ~ data:", data);
          this.leaveChartOptions.xaxis.categories = data.month_names;
          this.leaveChartSeries[0].data = data.month_values;

          this.leaveCardDisplay = data.month_values.some((e) => e > 0);
        });
    },

    setDataForDatePicker() {
      const date = new Date(); // This is a Date object, not a string
      let currentMonth = new Date(date.getFullYear(), date.getMonth() + 1)
        .toISOString()
        .substr(0, 7);

      let previousMonth = new Date(date.getFullYear(), date.getMonth())
        .toISOString()
        .substr(0, 7);

      this.selectedDatesForCurrentMonth = `${currentMonth}-01`;
      this.maxDateForCurrentMonth = `${currentMonth}-31`;

      this.selectedDate = `${previousMonth}-01`;
      this.maxDate = `${previousMonth}-31`;
    },
    getEventColors(e) {
      return this.events[e] || "";
    },
    getEventColorsForCurrentMonth(e) {
      return this.eventsForCurrentMonth[e] || "";
    },
  },
};
</script>
