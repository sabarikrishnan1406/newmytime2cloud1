<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="720">
      <template v-slot:activator="{ on, attrs }">
        <span class="ml-2 primary--text" small v-bind="attrs" v-on="on">
          {{ $auth.user.employee.first_name }}
          {{ $auth.user.employee.last_name }}
        </span>
        <div class="secondary-value ml-2">
          {{ $auth.user.employee?.designation?.name }}
        </div>
      </template>

      <v-card>
        <v-toolbar flat dense class="text-h6"
          ><b>Employee Details</b></v-toolbar
        >
        <v-divider></v-divider>
        <v-container>
          <v-row no-gutters>
            <v-col cols="5">
              <v-row class="mx-1" style="border-right: 1px solid #dddddd">
                <v-col cols="12" class="mt-1">
                  <v-row class="pa-1">
                    <v-col cols="12" class="text-center">
                      <v-avatar size="120">
                        <img
                          style="width: 100%"
                          :src="profile_pictrue"
                          alt="Avatar"
                        />
                      </v-avatar>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <div>
                        <b>EID: {{ $auth.user.employee.system_user_id }}</b>
                        <br />
                        {{ $auth.user.employee.first_name }}
                        {{ $auth.user.employee.last_name }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <table style="width: 100%; border-top: 1px solid #dddddd">
                    <tr v-for="(item, index) in employee_stats" :key="index">
                      <th class="text-left">{{ item.title }}</th>
                      <td class="text-right">{{ item.value }}</td>
                    </tr>
                  </table>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="7">
              <v-row no-gutters class="mb-2">
                <v-col
                  cols="4"
                  class="text-center"
                  style="
                    border-top: 1px solid #dddddd;
                    border-bottom: 1px solid #dddddd;
                    border-right: 1px solid #dddddd;
                  "
                >
                  <b>
                    {{ todayAttendance && todayAttendance.total_hrs }}
                  </b>
                  <div>Work Time</div>
                </v-col>
                <v-col
                  cols="4"
                  class="text-center"
                  style="
                    border-top: 1px solid #dddddd;
                    border-bottom: 1px solid #dddddd;
                  "
                >
                  <b>
                    {{ remainingTime }}
                  </b>
                  <div>Remaing Hours</div>
                </v-col>
                <v-col
                  cols="4"
                  class="text-center"
                  style="
                    border-top: 1px solid #dddddd;
                    border-bottom: 1px solid #dddddd;
                    border-left: 1px solid #dddddd;
                  "
                >
                  <b>
                    {{ todayAttendance && todayAttendance.ot }}
                  </b>
                  <div>OverTime</div>
                </v-col>
              </v-row>
              <v-card elevation="0">
                <v-container>
                  <v-data-table
                    dense
                    :headers="log_headers"
                    :items="logs_data"
                    hide-default-footer
                  >
                    <!-- <template v-slot:top>
      <div class="px-2"><b>Today Logs</b></div>
    </template> -->
                    <template v-slot:item.id="{ item, index }">
                      {{ index + 1 }}
                    </template>
                    <template v-slot:item.LogTime="{ item }">
                      {{ item.date }} {{ item.time }}
                    </template>
                    <template v-slot:item.gps_location="{ item }">
                      {{ item.gps_location || "---" }}
                    </template>
                  </v-data-table>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    logs_data: [],
    log_endpoint: "attendance_logs",
    log_headers: [
      {
        text: "#",
        align: "left",
        sortable: false,
        key: "id",
        value: "id",
        width: "10px",
      },
      {
        text: "DateTime",
        align: "left",
        sortable: false,
        key: "date_range",
        value: "LogTime",
        fieldType: "date_range_picker",
      },

      {
        text: "Location",
        align: "left",
        sortable: true,
        key: "gps_location",
        value: "gps_location",
        filterable: true,
        filterSpecial: true,
      },
    ],

    employee_stats_header: [{ value: "value" }],

    dialog: false,
    sinceDate: null,
    UserID: null,
    profile_pictrue: "no-profile-image.jpg",
    logsCount: null,
    company_id: 0,
    lastLog: null,
    employee_stats: [],
    todayAttendance: null,
    remainingTime: "00:00",

    headers: [
      { text: "LogTime", value: "LogTime" },
      { text: "Device", value: "DeviceID" },
    ],
    attendanceLogs: [],
    log_type: "",
    puching_image: "",
    response_image: "/sucess.png",
    uniqueDeviceId: null,
    device_id: null,
    isButtonDisabled: false,
    message: "",
    response: "",
    dialog: false,
    buttonLocked: false,
    locationError: null,
    intervalId: 0,
    locationData: null,
    initialPunch: true,
    shift_type_id: 0,
  }),

  mounted() {
    if (window.innerWidth >= 600) {
      this.$store.commit("isDesktop", true);
    } else {
      this.$store.commit("isDesktop", false);
    }

    this.getSinceDate();

    if (this.$localStorage.get("buttonLocked")) {
      this.buttonLocked = true;
      setTimeout(() => {
        this.buttonLocked = false;
        this.$localStorage.remove("buttonLocked");
      }, 60 * 1000);
    }
  },

  computed: {
    latitude() {
      return this.$store.state.latitude;
    },
    longitude() {
      return this.$store.state.longitude;
    },
    currentDate() {
      return this.$store.state.currentDate;
    },
  },

  async created() {
    let employee = this.$auth.user.employee;

    if (!employee) {
      this.$router.push("/login");
      return;
    }

    this.profile_pictrue = employee.profile_picture;
    this.UserID = employee.system_user_id;

    if (employee.schedule.shift) {
      this.shift_type_id = employee.schedule.shift_type_id;
    }

    this.company_id = this.$auth.user.company_id;
    this.device_id = `Mobile-${this.UserID}`;

    await this.getEmployeeStats();
    await this.getLastLog();
    await this.getTodayAttendance();
    await this.getRealTimeLocation();

    await this.getLogs();

    // try {
    //   let employee = this.$auth.user.employee;

    //   if (!employee) {
    //     this.$router.push("/login");
    //     return;
    //   }

    //   this.profile_pictrue = employee.profile_picture;
    //   this.UserID = employee.system_user_id;
    //   this.shift_type_id = (employee && employee.schedule.shift_type_id) || 0;
    //   this.company_id = this.$auth.user.company_id;
    //   this.device_id = `Mobile-${this.UserID}`;

    //   this.getEmployeeStats();
    //   this.getLastLog();
    //   this.getRealTimeLocation();
    //   this.getTodayAttendance();
    // } catch (e) {
    //   this.$router.push("/login");
    // }
  },
  methods: {
    getDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    async getLogs() {
      this.$axios
        .get(this.log_endpoint, {
          params: {
            per_page: 10,
            company_id: 2,
            UserID: 3,
            from_date: this.getDate(),
            to_date: this.getDate(),
          },
        })
        .then(({ data }) => {
          this.logs_data = data.data;
        });
    },
    lockButton() {
      this.buttonLocked = true;
      this.$localStorage.set("buttonLocked", "true");
      setTimeout(() => {
        this.buttonLocked = false;
        this.$localStorage.remove("buttonLocked");
      }, 60 * 1000);
    },
    async getLastLog() {
      this.$axios
        .get(`attendance_logs`, {
          params: {
            company_id: this.company_id,
            UserID: this.UserID,
            from_date: this.getFormattedDate(),
            to_date: this.getFormattedDate(),
          },
        })
        .then(({ data }) => {
          // if (data.data && data.data.length && (data.data[0].log_type == "in" ||data.data[0].log_type == "auto")) {
          if (!data?.data?.length) {
            this.log_type = "in";
            this.puching_image = "/C-IN.png";
            return;
          }
          if (
            data?.data?.length &&
            ["in", "auto"].includes(data.data[0].log_type)
          ) {
            this.log_type = "out";
            this.puching_image = "/C-OUT.png";
            this.initialPunch = false;

            if (this.$auth.user.tracking_status) {
              this.invokeRealtimeLocation();
            }
          } else {
            this.log_type = "in";
            this.puching_image = "/C-IN.png";
            clearInterval(this.intervalId);
          }
          this.lastLog = data.data[0];
        });
    },
    invokeRealtimeLocation() {
      this.insertRealTimeLocation();
      this.intervalId = setInterval(() => {
        this.insertRealTimeLocation();
      }, 60 * 1000);
    },
    submit() {
      if (this.lockPunchTime()) {
        this.dialog = true;
        this.message = `You can only punch after your last puch time (${this.lastLog.time})`;
        this.response_image = "/fail.png";
        setTimeout(() => (this.dialog = false), 3000);
        return;
      }

      if (this.buttonLocked) {
        this.dialog = true;
        this.message = "Next Clocking allowed after 1 minute only";
        this.response_image = "/fail.png";
        setTimeout(() => (this.dialog = false), 3000);
        return;
      }

      this.lockButton();
      this.processLog();
    },

    lockPunchTime() {
      if (!this.lastLog) return false;
      return (
        new Date() <
        new Date(`${this.lastLog.edit_date}T${this.lastLog.time}:00`)
      );
    },
    processLog() {
      let payload = {
        UserID: this.UserID,
        LogTime: `${this.getFormattedDate()} ${this.getFormattedTime()}`,
        log_type: this.log_type,
        DeviceID: this.device_id,
        company_id: this.$auth.user.company_id,
        gps_location: this.locationData.display_name || "location not found",
      };

      this.$axios
        .post(`/generate_log`, payload)
        .then(async ({ data }) => {
          this.dialog = true;

          if (!data.status) {
            this.message = data.message;
            this.response_image = "/fail.png";
            setTimeout(() => (this.dialog = false), 3000);
            return;
          }

          this.message = "Your clocking has been recorded successfully";
          this.response_image = "/success.png";

          await this.renderAttendance();
          this.registerDeviceIfNotExist();
        })
        .catch(({ message }) => {
          this.message = message;
          this.response_image = "/fail.png";
        });

      setTimeout(() => (this.dialog = false), 3000);
    },

    async renderAttendance() {
      try {
        const { data } = await this.$axios.get(`/render_logs`, {
          params: {
            company_ids: [this.company_id],
            employee_ids: [this.UserID],
            dates: [this.getFormattedDate(), this.getFormattedDate()],
            shift_type_id: this.shift_type_id,
          },
        });

        await this.getEmployeeStats();
        await this.getLastLog();
        await this.getTodayAttendance();
      } catch (error) {
        console.error(error);
      }
    },

    insertRealTimeLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            let payload = {
              company_id: this.company_id,
              device_id: this.device_id,
              UserID: this.UserID,
              latitude,
              longitude,
              short_name: "---",
              full_name: "---",
            };

            this.$axios
              .post(`/realtime_location`, payload)
              .then(async ({ data }) => {
                await this.setRealTimeLocation(latitude, longitude);
              })
              .catch(({ message }) => console.log(message));
          },
          ({ message }) => {
            this.locationError = message;
          }
        );
      } else {
        this.locationError = "Location not available";
      }
    },
    registerDeviceIfNotExist() {
      let payload = {
        device_id: this.device_id,
        name: this.device_id,
        short_name: this.device_id,
        model_number: this.device_id,
        location: this.locationData.display_name ?? "---",
        company_id: this.$auth.user.company_id,
        branch_id: this.$auth.user.employee.branch_id,
        status_id: 1,
        function: "ignore",
        utc_time_zone: "ignore",
        device_type: "Mobile",
        ip: "0.0.0.0",
        port: "0000",
      };

      this.$axios
        .post(`/device`, payload)
        .then(({ data }) => console.log(data.message))
        .catch(({ message }) => console.log(message));
    },

    getSinceDate() {
      const currentDate = new Date();
      const day = `1`.padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      this.sinceDate = `${day}/${month}/${year}`;
    },

    getFormattedTime() {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
    },

    async setRealTimeLocation(latitude, longitude) {
      this.$axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
        .then(({ data }) => {
          this.initialPunch = false;
          this.locationData = data;
          this.$store.commit("latitude", latitude);
          this.$store.commit("longitude", longitude);
          this.$store.commit("currentDate", this.getFormattedDate());
        })
        .catch(({ message }) => console.log((this.locationError = message)));
    },
    async getRealTimeLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            this.$axios
              .get(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              )
              .then(({ data }) => {
                this.locationData = data;
                this.$store.commit("currentDate", this.getFormattedDate());
              })
              .catch(({ message }) =>
                console.log((this.locationError = message))
              );
          },
          ({ message }) => {
            this.locationError = message;
          }
        );
      } else {
        this.locationError = "Location not available";
      }
    },
    async getTodayAttendance() {
      this.$axios
        .get(`report`, {
          params: {
            company_id: this.company_id,
            employee_id: this.UserID,
            from_date: this.getFormattedDate(),
            to_date: this.getFormattedDate(),
          },
        })
        .then(({ data }) => {
          if (!data.data.length) {
            this.getRemainingTime("00:00", "00:00");
            this.todayAttendance = { total_hrs: "00:00", ot: "00:00" };
            return;
          }

          const { total_hrs, ot, shift } = data.data[0];

          if (!shift) {
            this.getRemainingTime("00:00", "00:00");
            this.todayAttendance = { total_hrs: "00:00", ot: "00:00" };
            return;
          }

          this.todayAttendance = {
            total_hrs: this.timeHandler(total_hrs),
            ot: this.timeHandler(ot),
          };
          this.getRemainingTime(
            this.timeHandler(total_hrs),
            this.timeHandler(shift.working_hours)
          );
        });
    },
    timeHandler(value) {
      return value === "---" ? "00:00" : value;
    },
    async getEmployeeStats() {
      this.$axios
        .get(`employee-statistics`, {
          params: {
            company_id: this.company_id,
            employee_id: this.UserID,
          },
        })
        .then(({ data }) => {
          this.employee_stats = data;
        });
    },
    goToPage(page) {
      this.$router.push(page);
    },
    getFormattedDate() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")}`;
    },

    getRemainingTime(totalHours, performedHours) {
      const [totalHoursStr, totalMinutesStr] = totalHours
        .split(":")
        .map(Number);
      const [performedHoursStr, performedMinutesStr] = performedHours
        .split(":")
        .map(Number);

      const totalMinutes = totalHoursStr * 60 + totalMinutesStr;
      const performedMinutes = performedHoursStr * 60 + performedMinutesStr;

      const remainingMinutes = totalMinutes - performedMinutes;

      if (remainingMinutes < 0) {
        const remainingHours = Math.abs(Math.ceil(remainingMinutes / 60));
        const remainingMinutesPart = Math.abs(remainingMinutes % 60);
        this.remainingTime = `${String(remainingHours).padStart(
          2,
          "0"
        )}:${String(remainingMinutesPart).padStart(2, "0")}`;
      }
    },
  },
};
</script>
