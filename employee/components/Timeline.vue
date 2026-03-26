<template>
  <v-row class="pa-3">
    <v-col cols="12">Announcements</v-col>
    <v-col>
      <v-timeline dense clipped>
        <v-timeline-item
          v-for="(announcement, index) in announcements"
          :key="index"
          class="mb-4"
          :color="getPriorityColor(announcement?.category?.name)"
          :icon-color="getPriorityColor(announcement?.category?.name)"
          small
        >
          <v-row justify="space-between">
            <v-col cols="12">
              {{ announcement.title }}
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-timeline>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    announcements: [],
    input: null,
    nonce: 0,
  }),
  async mounted() {
    await this.getDataFromApi();
  },
  methods: {
    async getDataFromApi() {
      const company_id = this.$auth.user.company_id;
      const employee_id = this.$auth.user.employee.id;

      this.$axios
        .get(
          `employee-announcements/${employee_id}?&company_id=${company_id}&per_page=1000`
        )
        .then(({ data }) => {
          if (data.data.length == 0) {
            return false;
          }
          this.announcements = data.data;
        });
    },
    getPriorityColor(category) {
      if (!category) return "";

      switch (category) {
        case "Urgent":
          return "red"; // Vuetify red
        case "Informational":
          return "indigo"; // Vuetify indigo
        case "Meeting":
          return "deep-orange"; // Vuetify deep-orange
        case "Priority":
          return "green"; // Vuetify green
        case "Low Priority":
          return "black"; // Vuetify doesn't have "black", use custom CSS if needed
        default:
          return "grey"; // fallback/default color
      }
    },
  },
};
</script>
