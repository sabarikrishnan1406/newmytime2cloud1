<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="6">
        <div class="text-center">
          <Camera
          style="border: 1px solid #6946dd"
          :isImageBox="isImageBox"
          class="mb-5"
          @imageSrc="(e) => (photo = e)"
          ref="cameraComponent"
        />
        </div>
        <div class="text-center">
        <v-btn v-if="isImageBox" @click="openCamera" small class="primary"
          >Open Camera</v-btn
        >
        <v-btn v-else @click="takePicture" small class="primary"
          >Take Picture</v-btn
        >
      </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "login",
  auth: false,

  data: () => ({
    isImageBox: true,
    photo: null,
  }),
  methods: {
    openCamera() {
      this.isImageBox = false;
      this.$refs.cameraComponent.openCamera();
    },
    takePicture() {
      this.isImageBox = true;
      this.$refs.cameraComponent.takePicture();
    },
  },
};
</script>
