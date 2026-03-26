<template>
  <div class="text-center" style="width: 80px; margin: 25% auto">
    <v-img :src="`/preloaders/${icon}.gif`"></v-img>
  </div>
</template>
<script>
export default {
  props: ["icon"],
};
</script>
