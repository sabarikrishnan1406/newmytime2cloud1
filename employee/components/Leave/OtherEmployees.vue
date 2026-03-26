<template>
  <v-card
    v-if="profiles.length"
    outlined
    flat
    style="width: 100%; max-height: 350px; overflow: auto; margin-top: 15px"
  >
    <table style="width: 100%">
      <tr v-for="(item, index) in profiles" :key="index">
        <td
          style="
            border-bottom: 1px solid #eaeaeaea;
            padding-top: 5px;
            padding-bottom: 5px;
          "
        >
          <v-avatar size="25">
            <v-img
              v-if="item.profile_picture"
              :src="item.profile_picture"
              alt="Avatar"
            />
          </v-avatar>
        </td>
        <td
          style="
            font-size: 11px;
            border-bottom: 1px solid #eaeaeaea;
            padding-top: 5px;
            padding-bottom: 5px;
          "
        >
          {{ item.name }}
        </td>
        <td
          class="text-right"
          style="
            font-size: 11px;
            border-bottom: 1px solid #eaeaeaea;
            padding-top: 5px;
            padding-bottom: 5px;
          "
        >
          <span class="text-grey-darken-1">{{ item.date }}</span>
        </td>
        <td
          style="
            width: 70px;
            font-size: 11px;
            border-bottom: 1px solid #eaeaeaea;
            padding-top: 5px;
            padding-bottom: 5px;
          "
        >
          <span class="ml-4">{{ item.duration }}</span>
        </td>
      </tr>
    </table>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    profiles: [],
  }),
  async mounted() {
    await this.getEmployeeProfiles(this.$auth?.user?.company_id || 0);
  },
  methods: {
    async getEmployeeProfiles(id) {
      let { data } = await this.$axios.get(
        `/employee_leaves_for_next_thirty_days_month?company_id=${id}`
      );
      this.profiles = data.map((e) => ({
        name: e?.employee?.first_name,
        profile_picture: e?.employee?.profile_picture,
        // profile_picture: `https://cdn.vuetifyjs.com/images/lists/1.jpg`,
        date: e.start_date,
        start_date: e.start_date,
        end_date: e.end_date,
        duration: `${this.getDayDifference(e.start_date, e.end_date)} Days`,
      }));
    },
    getDayDifference(start_date, end_date) {
      const from = new Date(start_date);
      const to = new Date(end_date);
      return Math.max(1, (to - from) / (1000 * 60 * 60 * 24) + 1);
    },
  },
};
</script>
