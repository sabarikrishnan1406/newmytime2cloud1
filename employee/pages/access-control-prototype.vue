<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          hide-details
          dense
          outlined
          label="Device Id"
          v-model="device_id"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-card outlined class="pa-5 mt-5">
      <v-row>
        <v-col cols="12">
          Time Slots

          <v-btn fab class="primary" x-small @click="addOpenSlot"
            ><v-icon dark>mdi-plus</v-icon></v-btn
          >
        </v-col>
      </v-row>
      <v-row v-for="(slot, index) in timeSlots" :key="index">
        <v-col cols="6">
          <v-text-field
            type="time"
            hide-details
            dense
            outlined
            color="success"
            label="Start Time"
            v-model="slot.startTimeOpen"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="time"
            hide-details
            dense
            outlined
            color="success"
            label="End Time"
            v-model="slot.endTimeOpen"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-icon
            v-if="timeSlots.length"
            color="red"
            @click="removeOpenSlot(index)"
            >mdi-delete</v-icon
          >
        </v-col>
      </v-row>
    </v-card>

    <v-card flat class="mt-5">
      <v-row>
        <v-col cols="12">
          <v-btn block class="primary" small @click="submit">Submit</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      device_id: "OX-8862021010010",
      timeSlots: [
        {
          startTimeOpen: "09:00", // Default start time
          endTimeOpen: "14:00", // Default end time
        },
      ],
      payload: {},
    };
  },
  computed: {
    isAllowed() {
      // Access control logic (unchanged)
    },
  },
  methods: {
    addOpenSlot() {
      this.timeSlots.push({
        startTimeOpen: "09:00", // Default start time
        endTimeOpen: "14:00", // Default end time
      });
    },
    removeOpenSlot(index) {
      this.timeSlots.splice(index, 1);
    },

    submit() {
      this.payload = {
        device_id: this.device_id,

        json: this.timeSlots,
      };

      this.$axios
        .post(
          `https://backend.eztime.online/api/access-control-time-slot`,
          this.payload
        )
        .then(({ data }) => {
          alert(data.message);
        });
    },
  },
};
</script>
