<template>
  <div class="text-left mt-5">
    <v-container v-if="navigator">
      <div><b>appCodeName: </b> {{ navigator.appCodeName }}</div>
      <v-divider></v-divider>
      <div><b>appName: </b> {{ navigator.appName }}</div>
      <v-divider></v-divider>
      <div><b>appName: </b> {{ navigator.appVersion }}</div>
      <v-divider></v-divider>
      <div><b>product: </b> {{ navigator.product }}</div>
      <v-divider></v-divider>
      <div><b>productSub: </b> {{ navigator.productSub }}</div>
      <v-divider></v-divider>
      <div><b>serial onconnect: </b> {{ serial && serial.onconnect }}</div>
      <div>
        <b>serial ondisconnect: </b> {{ serial && serial.ondisconnect }}
      </div>

      <v-divider></v-divider>
      <div><b>userAgent: </b> {{ navigator.userAgent }}</div>
      <v-divider></v-divider>
      <!-- <div>
        <b>Brands: </b>
        <li v-for="(brand, index) in brands" :key="index">
          {{ brand.brand }}
        </li>
      </div> -->
      <v-divider></v-divider>
      <div><b>platform: </b> {{ navigator.platform }}</div>
      <v-divider></v-divider>
      <div><b>mobile: </b> {{ navigator.mobile ? "true" : "false" }}</div>
      <!-- <v-data-table :headers="headers" :items="attendanceLogs"></v-data-table> -->
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [
      { text: "LogTime", value: "LogTime" },
      { text: "Device", value: "DeviceID" },
      { text: "location", value: "location" },
    ],
    formattedDateTime: null,
    UserID: null,
    attendanceLogs: [],
    profile_pictrue: "",
  }),
  computed: {
    locationData() {
      return this.$store.state.locationData;
    },

    navigator() {
      return this.$store.state.navigator;
    },
    brands() {
      let navigator = this.$store.state.navigator;
      return navigator.userAgentData && navigator.userAgentData.brands;
    },
    serial() {
      let navigator = this.$store.state.navigator;
      return navigator.serial && navigator.serial;
    },
  },

  created() {
    if (this.$auth.user.employee) {
      this.UserID = this.$auth.user.employee.system_user_id;
      this.profile_pictrue = this.$auth.user.employee.profile_picture;
    }
  },
  methods: {
    getFormattedDateTime(type) {
      // Get the current date and time
      const now = new Date();

      // Format the date and time as "YYYY-MM-DD HH:mm"
      this.formattedDateTime = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      let payload = {
        UserID: this.UserID,
        LogTime: this.formattedDateTime,
        DeviceID: type,
        company_id: this.$auth.user.company_id,
      };

      // console.log(payload);

      return;

      this.$axios
        .post(`/generate_log`, payload)
        .then(({ data }) => {
          if (!data.status) {
            return;
          } else {
            this.payload.locadtion = this.locationData.name;
            this.attendanceLogs.push(payload);
          }
        })
        .catch(({ message }) => {
          console.log(message);
        });
    },
  },
};
</script>

<style scoped>
@media only screen and (max-width: 600px) {
  .v-data-table-header.v-data-table-header-mobile {
    display: none;
  }
}
</style>
