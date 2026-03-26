<template>
  <div>
    <v-alert v-if="!shift_type_id" class="red lighten-2" dark dense flat>
      <div class="">Your are not schedule yet</div>
    </v-alert>
    <div class="text-center">
      <v-dialog
        class="remove-transparent-bg"
        style="box-shadow: none !important"
        v-model="dialog"
        width="500"
      >
        <v-card style="background: none">
          <v-toolbar style="background: none" flat dense>
            <v-spacer></v-spacer>
            <!-- <v-icon @click="dialog = false">mdi-close</v-icon> -->
          </v-toolbar>

          <v-card-text>
            <p class="text-center">
              <v-img
                :src="response_image"
                alt="Avatar"
                height="125px"
                width="125px"
                style="display: inline-block"
              ></v-img>
            </p>
            <!-- <p class="text-center">
                      {{ message }}
                    </p> -->
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <v-card :class="$isDark() ? 'accent' : 'light-background'">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" class="text-center">
            <v-avatar size="150">
              <img style="width: 100%" :src="profile_pictrue" alt="Avatar" />
            </v-avatar>
          </v-col>
          <!-- <v-col cols="12">
            <div class="text-center">
              <v-btn @click="goToPage('/profile')" color="primary" outlined>
                <b>My Profile</b>
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" class="text-center">
            <WallClock />
          </v-col> -->
          <v-col cols="12" class="text-center">
            <div class="text-h6">
              <b
                >{{ $auth.user.employee.first_name }}
                {{ $auth.user.employee.last_name }}</b
              >
              <!-- <v-btn @click="goToPage('/profile')" color="primary" outlined>
                <b>My Profile</b>
              </v-btn> -->
            </div>
            <WallClock />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            class="text-center"
            style="border-top: 1px solid #b8a9eb"
          >
            <div>
              <span :style="{ color: $isDark() ? '' : '#8f31e9' }"
                >Self Discipline Indicator</span
              >
              <span> (For own reference only)</span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="4"
            class="text-center"
            style="
              border-top: 1px solid #b8a9eb;
              border-bottom: 1px solid #b8a9eb;
            "
          >
            <v-sheet
              class="text-h6"
              :class="$isDark() ? 'accent' : 'light-background'"
            >
              {{ todayAttendance && todayAttendance.total_hrs }}
            </v-sheet>
            <div>Work Time</div>
          </v-col>
          <v-col cols="4" class="text-center" style="border: 1px solid #b8a9eb">
            <v-sheet
              class="text-h6"
              :class="$isDark() ? 'accent' : 'light-background'"
            >
              {{ remainingTime }}
            </v-sheet>
            <div>Remaing Hours</div>
          </v-col>
          <v-col
            cols="4"
            class="text-center"
            style="
              border-top: 1px solid #b8a9eb;
              border-bottom: 1px solid #b8a9eb;
            "
          >
            <v-sheet
              class="text-h6"
              :class="$isDark() ? 'accent' : 'light-background'"
            >
              {{ todayAttendance && todayAttendance.ot }}
            </v-sheet>
            <div>OverTime</div>
          </v-col>
        </v-row>
        <v-row style="border-bottom: 1px solid #b8a9eb">
          <v-col cols="12" class="text-center">
            <div>
              <span>My Attendance</span>
              <span :style="{ color: $isDark() ? '' : '#8f31e9' }">
                - Since {{ sinceDate }}
              </span>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-container>
              <v-row>
                <v-col cols="6" class="text-center">
                  <div class="text-center mt-5">
                    <v-avatar size="125">
                      <img
                        style="width: 100%; height: auto"
                        :src="puching_image"
                        alt="loading..."
                        @click="submit"
                      />
                    </v-avatar>
                  </div>
                </v-col>

                <v-col cols="6">
                  <v-row
                    no-gutters
                    v-for="(item, index) in employee_stats"
                    :key="index"
                    class="greys"
                    style="
                      padding: 1px !important;
                      border-bottom: 0px solid #b8a9eb;
                    "
                  >
                    <v-col cols="10">{{ item.title }} </v-col>
                    <v-col class="text-right">
                      <span>
                        {{ item.value }}
                      </span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <div class="error--text" v-if="locationError">
                    {{ locationError }}
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>

        <v-footer app class="ma-0 pa-0" style="border-top: 1px solid #dddddd">
          <v-row no-gutters :class="$isDark() ? 'accent' : 'light-background'">
            <v-col cols="12" class="pl-2">
              <div class="text-h6">Location</div>

              <div class="">
                <b>{{ lastLog && lastLog.device && lastLog.gps_location }}</b>

                <v-icon style="margin-top: -2%" color="green"
                  >mdi-map-marker-radius</v-icon
                >
              </div>
              <span class="white--text">
                {{ lastLog && lastLog.date }} {{ lastLog && lastLog.time }}
              </span>
            </v-col>
            <!-- <v-col
              @click="goToPage(`logs`)"
              cols="1"
              class="indigo text-center white--text d-flex align-center justify-center"
            >
              <span class="white--text" dark>
                <v-icon dark>mdi-chevron-right</v-icon>
              </span>
            </v-col> -->
          </v-row>
        </v-footer>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
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
    initialCount: 59,
  }),

  mounted() {
    if (window.innerWidth >= 600) {
      this.$store.commit("isDesktop", true);
    } else {
      this.$store.commit("isDesktop", false);
    }

    this.getSinceDate();

    if (process.client) {
      let savedTimer = localStorage.getItem("timeCounter");
      if (savedTimer !== null && !isNaN(savedTimer)) {
        this.initialCount = savedTimer < 0 ? 59 : parseInt(savedTimer);
      }

      this.lockButton();
    }

    if (this.$store.state.isDesktop) {
      this.$router.push(`/dashboard`);
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
    lockButton() {
      this.timeCounterInterval = setInterval(() => {
        if (this.initialCount > 0) {
          this.buttonLocked = true;
          this.$localStorage.set("timeCounter", --this.initialCount);
        } else {
          clearInterval(this.timeCounterInterval);
          this.buttonLocked = false;
          this.initialCount = 59;
        }
      }, 1000);
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
          if (data?.data?.length % 2 !== 0) {
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
