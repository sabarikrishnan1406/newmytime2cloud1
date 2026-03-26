<template>
  <v-card
    :class="$isDark() ? 'accent white--text' : 'light-background black--text'"
  >
    <slot name="body"></slot>
  </v-card>
</template>

<script>
export default {
  name: "BaseCard",
};
</script>
