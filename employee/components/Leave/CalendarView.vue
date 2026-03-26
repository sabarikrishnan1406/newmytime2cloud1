<template>
  <v-date-picker
    :class="
      $isDark()
        ? 'accent white--text dark-mode'
        : 'light-background black--text'
    "
    elevation="2"
    :landscape="true"
    dense
    full-width
    no-title
    v-model="date1"
    :events="Object.keys(events)"
    :event-color="getEventColors"
    color="blue"
  >
    <template v-slot:default>
      <table style="width: 100%; table-layout: fixed">
        <tr>
          <td style="width: 20px; min-width: 10px">
            <div
              class="grey"
              style="
                width: 10px;
                height: 10px;
                border-radius: 50%;
                display: inline-block;
              "
            ></div>
          </td>
          <td style="white-space: nowrap">
            <div style="font-size: 11px">WeekOff</div>
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
            <div style="font-size: 11px">Leave</div>
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
            <div style="font-size: 11px">Holiday</div>
          </td>
        </tr>
      </table>
    </template></v-date-picker
  >
</template>

<script>
export default {
  data: () => ({
    date1: null,
    events: {},
  }),
  async mounted() {
    await this.getLeaveEvents(this.$auth?.user?.company_id || 0);
  },
  methods: {
    async getLeaveEvents(id) {
      let { data } = await this.$axios.get(
        `https://mytime2cloud-backend.test/api/employee_leaves_events?company_id=${id}`
      );
      this.events = data;
    },
    getEventColors(e) {
      return this.events[e] || "";
    },
  },
};
</script>
