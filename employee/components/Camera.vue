<template>
  <v-avatar size="200">
    <v-img v-show="isImageBox" :src="imageSrc" />
    <video v-show="!isImageBox" ref="video" autoplay playsinline></video>
  </v-avatar>
</template>

<script>
export default {
  props: ["isImageBox"],
  data() {
    return {
      videoStream: null,
      imageSrc: "/no-profile-image.jpg",
    };
  },
  methods: {
    async openCamera() {
      const video = this.$refs.video;
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      video.srcObject = mediaStream;
      this.videoStream = mediaStream;
    },
    async takePicture() {
      const targetWidth = 200; // Desired width for the captured image
      const video = this.$refs.video;

      // Create a canvas to capture the video frame
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = (video.videoHeight / video.videoWidth) * targetWidth;

      // Calculate the height based on the video's aspect ratio

      // Draw the resized video frame onto the canvas
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to a data URL with JPEG format
      this.imageSrc = canvas.toDataURL("image/jpeg");

      // Emit the captured image source
      this.$emit("imageSrc", this.imageSrc);
    }
  },
  beforeDestroy() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
    }
  },
};
</script>
