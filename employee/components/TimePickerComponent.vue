<template>
  <v-menu
    ref="menu"
    dense
    v-model="menu2"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="15%"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        outlined
        dense
        v-model="time"
        append-icon="mdi-clock-time-four-outline"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-list style="height:55px;">
      <v-list-item>
        <v-row class="">
          <v-col cols="6">
            <v-text-field
              v-model="hour"
              @input="updateTime"
              @click="updateTime"
              @keydown.up.prevent="incrementHour"
              @keydown.down.prevent="decrementHour"
              @keydown.enter.prevent="menu2 = false"
              outlined
              dense
              placeholder="HH"
              type="number"
              min="0"
              max="23"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
            v-model="minute"
            @input="updateTime"
            @click="updateTime"
            @keydown.up.prevent="incrementMinute"
            @keydown.down.prevent="decrementMinute"
            @keydown.enter.prevent="menu2 = false"
            outlined
            dense
            placeholder="MM"
            type="number"
            min="0"
            max="59"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  auth: false,
  layout: "login",
  data() {
    return {
      hour: "00",
      minute: "00",
      menu2: false,
      time: "00:00",
    };
  },
  methods: {
    updateTime() {
      // Ensure that hour and minute values are within valid ranges
      if (this.hour < 0) this.hour = 0;
      if (this.hour > 23) this.hour = 23;
      if (this.minute < 0) this.minute = 0;
      if (this.minute > 59) this.minute = 59;

      // You can use this.hour and this.minute values as needed.
      // For example, you can update a data property like "time".
      this.time = `${String(this.hour).padStart(2, "0")}:${String(
        this.minute
      ).padStart(2, "0")}`;

      this.$emit("timeExpose", this.time);
    },
    incrementHour() {
      this.hour = (this.hour + 1) % 24; // Increment and wrap around
      this.updateTime();
    },
    decrementHour() {
      this.hour = (this.hour - 1 + 24) % 24; // Decrement and wrap around
      this.updateTime();
    },
    incrementMinute() {
      this.minute = (this.minute + 1) % 60; // Increment and wrap around
      this.updateTime();
    },
    decrementMinute() {
      this.minute = (this.minute - 1 + 60) % 60; // Decrement and wrap around
      this.updateTime();
    },
  },
};
</script>
<!-- <style>
/* Increase the size of the up and down arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  font-size: 20px !important; /* Adjust the font size to change arrow size */
  padding: 5px !important; /* Adjust the padding to change arrow size */
}
</style> -->
