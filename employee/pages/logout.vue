<template>
  <div></div>
</template>
<script>
export default {
  data: () => ({}),

  computed: {},
  mounted() {
    this.$axios.get(`/logout`).then(({ res }) => {
      this.$auth.logout();
      this.$router.push(`/login`);
    });
  },
  watch: {},
  created() {
    this.$axios.get(`/logout`).then(({ res }) => {
      this.$auth.logout();
      this.$router.push(`/login`);
    });
  },

  methods: {},
};
</script>
