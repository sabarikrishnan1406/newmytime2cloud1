<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          this.$axios
            .get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            )
            .then(({ data }) => {
              this.$store.commit("navigator", navigator);
              this.$store.commit("locationData", data);
            })
            .catch((error) => this.$store.commit("locationError", error));
        },
        (error) => this.$store.commit("locationError", error)
      );
    } else {
      this.$store.commit("locationError", "Location not available");
    }
  },
};
</script>
