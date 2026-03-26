<template>
  <v-row class="px-5">
    <v-col cols="1">
      <v-icon color="primary">mdi-arrow-up</v-icon>
    </v-col>
    <v-col cols="5">
      <div>
        <div>Best Employee</div>
        <div class="text-caption">Mark Marvin</div>
      </div>
    </v-col>
    <v-col cols="6" class="text-right">4.17 / 5 (Rating) </v-col>

    <v-col cols="1">
      <v-icon color="red">mdi-arrow-down</v-icon>
    </v-col>
    <v-col cols="5">
      <div>
        <div>Least Employee</div>
        <div class="text-caption">Latifah</div>
      </div>
    </v-col>
    <v-col cols="6" class="text-right"> 0 / 5 (Rating) </v-col>
  </v-row>
</template>
<script>
export default {
  
  props: ["company_id"],

  data() {
    return {
      item: null,
      loading: true,
    };
  },

  computed: {
    isDarkMode() {
      return this.$isDark();
    },
  },

  watch: {
    isDarkMode() {},
  },

  methods: {},

  async mounted() {
    try {
      this.item = await this.$axios.$get(`/upcoming-holiday?company_id=${this.company_id}`);
      this.loading = false;
    } catch (error) {
      console.error("Failed to load attendance summary:", error);
    }
  },
};
</script>
