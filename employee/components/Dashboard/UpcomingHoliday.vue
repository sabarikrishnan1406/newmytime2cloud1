<template>
  <div
    class="pa-3"
    style="display: flex; justify-content: space-between; justify-items: center"
  >
    <div>Upcoming Holiday</div>
    <div>
      <b>{{ item?.name }}</b>
      <v-icon class="ml-1" small color="success">mdi-arrow-up</v-icon>
    </div>
  </div>
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

  async mounted() {
    try {
      this.item = await this.$axios.$get(
        `/upcoming-holiday?company_id=${this.company_id}`
      );
      this.loading = false;
    } catch (error) {
      console.error("Failed to load attendance summary:", error);
    }
  },
};
</script>
