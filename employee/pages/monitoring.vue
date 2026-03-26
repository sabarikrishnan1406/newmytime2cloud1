<template>
  <div class="text-center mt-5">
    <v-container>
      <v-sheet class="text-h4 text-center">
        {{ currentTime }}
      </v-sheet>
      <!-- <v-sheet class="text-h4 text-center">
        {{ latitude }} - {{ longitude }}
      </v-sheet> -->
      <div class="text-center">{{ formattedDateTime || "Loading..." }}</div>

      <!-- <div class="text-center">formattedDateTime  EID: {{ UserID }}</div> -->

      <v-card flat>
        <v-avatar size="150" class="mt-10">
          <!-- <img :src="profile_pictrue" alt="Avatar" /> -->
          <img
            v-if="disableCheckOutButton"
            src="/C-IN.png"
            alt="Avatar"
            @click="generateLog(`in`)"
          />
          <img
            v-if="disableCheckInButton"
            src="/C-OUT.png"
            alt="Avatar"
            @click="generateLog(`out`)"
          />
        </v-avatar>

        <div class="text-center mt-5">
          <v-icon>mdi-map-marker-radius</v-icon
          ><span class="mx-1 pt-2">{{
            (locationData && locationData.name) || "Getting location..."
          }}</span>
        </div>
      </v-card>
    </v-container>
    <transition name="slide-y-transition">
      <div class="text-center mt-5">
        <v-img
          v-if="isSuccess"
          src="/sucess.png"
          alt="Avatar"
          height="50px"
          width="50px"
          style="display: inline-block"
        ></v-img>
        <v-img
          v-else-if="isSuccess == false"
          src="/fail.png"
          alt="Avatar"
          height="50px"
          width="50px"
          style="display: inline-block"
        ></v-img>
      </div>
    </transition>
    <div class="error--text" v-if="locationError">{{ locationError }}</div>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [
      { text: "LogTime", value: "LogTime" },
      { text: "Device", value: "DeviceID" },
      // { text: "location", value: "location" },
    ],
    formattedDateTime: null,
    UserID: null,
    attendanceLogs: [],
    profile_pictrue: "no-profile-image.jpg",
    uniqueDeviceId: null,
    device_id: null,
    isButtonDisabled: false,
    dialog: false,
    message: "",
    response: "",
    shift_type_id: "",
    logsCount: null,

    disableCheckInButton: false,
    disableCheckOutButton: true,

    currentTime: "",
    formattedDateTime: "",
    isSuccess: null,
    locationData: {},
    coordinates: {},
    longitude: 0,
    latitude: 0,

    locationError: null,
    company_id: 0,
    intervalId: 0,
    latitude: null,
    longitude: null,
    currentDate: null,
  }),
  async mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
    await this.getRealTimeLocation();
  },

  async created() {
    let employee = this.$auth.user.employee;
    this.UserID = employee.system_user_id;
    this.profile_pictrue = employee.profile_picture;
    this.shift_type_id = employee.schedule.shift_type_id;
    this.company_id = this.$auth.user.company_id;
    this.device_id = `Mobile-${this.UserID}`;
    // this.getLogs();
  },
  methods: {
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

    async insertRealTimeLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            if (
              this.latitude == latitude &&
              this.longitude == longitude &&
              this.currentDate == this.getFormattedDate()
            ) {
              console.log(`same location found on ${this.currentDate} date.`);
              return;
            }

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
              .then(({ data }) => {
                this.latitude = latitude;
                this.longitude = longitude;
                this.currentDate = this.getFormattedDate();
                console.log(`RealTimeLocation response start`);
                console.log(data);
                console.log(`RealTimeLocation response end`);
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
    generateLog(type) {
      let payload = {
        UserID: this.UserID,
        LogTime: `${this.getFormattedDate()} ${this.getFormattedTime()}`,
        log_type: type,
        DeviceID: this.device_id,
        company_id: this.$auth.user.company_id,
        gps_location: this.locationData.name || "location not found",
      };

      this.$axios
        .post(`/generate_log`, payload)
        .then(({ data }) => {
          this.dialog = true;

          if (!data.status) {
            this.message = data.message;
            this.isSuccess = false;
          }

          this.message = "Success";
          this.isSuccess = true;

          setTimeout(() => (this.isSuccess = null), 3000);

          this.ifExist();

          if (type == "in") {
            this.insertRealTimeLocation();
            this.disableCheckInButton = true;
            this.disableCheckOutButton = false;
            this.intervalId = setInterval(() => {
              this.insertRealTimeLocation();
            }, 60 * 1000);
          } else {
            this.disableCheckInButton = false;
            this.disableCheckOutButton = true;
            clearInterval(this.intervalId);
          }
        })
        .catch(({ message }) => {
          this.message = message;
          this.isSuccess = false;
          console.log(`catch`);
          console.log(message);
          console.log(`catch end`);

          setTimeout(() => (this.isSuccess = null), 1000);
        });
    },
    ifExist() {
      this.$axios
        .get(`/device-by-user/${this.device_id}`)
        .then(({ data }) => {
          if (!data) {
            this.registerDevice();
          } else {
            console.log(`This device id already exist`);
          }
        })
        .catch(({ message }) => console.log(message));
    },
    registerDevice() {
      let payload = {
        device_id: this.device_id,
        name: "Mobile",
        short_name: "Mobile",
        model_number: this.device_id,
        location: this.locationData.name ?? "---",
        company_id: this.$auth.user.company_id,
        branch_id: this.$auth.user.branch_id,
        status_id: 1,
        function: "ignore",
        utc_time_zone: "ignore",
        device_type: "Mobile",
        ip: "0.0.0.0",
        port: "0000",
      };

      this.$axios
        .post(`/device`, payload)
        .then(({ data }) => console.log(`This device registered successfully`))
        .catch(({ message }) => console.log(message));
    },

    getFormattedTime() {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
    },

    getFormattedDate() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")}`;
    },

    updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      this.currentTime = `${hours}:${minutes}:${seconds}`;
    },

    updateDateTime() {
      const now = new Date();
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const dayOfWeek = daysOfWeek[now.getDay()];
      const month = months[now.getMonth()];
      const dayOfMonth = now.getDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      this.formattedDateTime = `${dayOfWeek}, ${month} ${dayOfMonth}`;
      this.currentTime = `${hours}:${minutes}:${seconds}`;
    },
  },
};
</script>
<style scoped>
.slide-y-enter-active,
.slide-y-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-y-enter, .slide-y-leave-to /* .slide-y-leave-active below version 2.1.8 */ {
  transform: translateY(100%);
  opacity: 0;
}
.slide-y-leave-active {
  position: absolute;
}
</style>
