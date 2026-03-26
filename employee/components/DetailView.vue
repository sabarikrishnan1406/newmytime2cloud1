<template>
  <div v-if="Object.keys(data).length > 0">
    <div v-for="(item, index) in data" :key="index">
      <span
        ><b> {{ index }}</b></span
      >
      <span style="float: right">
        {{ item }}
      </span>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
export default {
  props: ["endpoint", "cols"],
  data: () => ({
    data: {},
  }),

  created() {
    this.$axios
      .get(`${this.endpoint}/${this.$auth.user.employee.id}`)
      .then(({ data }) => {
        let filteredData = {};
        this.cols.forEach((col) => {
          if (data.hasOwnProperty(col)) {
            filteredData[this.toTitleCase(col)] = data[col];
          }
        });
        this.data = filteredData;
        this.$emit("success", data);
      });
  },
  methods: {
    filterItems(item) {},
    toTitleCase(str) {
      return str.replace(/_/g, " ").replace(/\w\S*/g, function (text) {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
      });
    },
  },
};
</script>

<style scoped></style>
