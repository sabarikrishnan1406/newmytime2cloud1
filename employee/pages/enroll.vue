<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-dialog persistent v-model="dialog">
          <v-card>
            <v-toolbar dense color="purple">
              {{ response }}
              <!-- {{ response.status }} - {{ response.uuid }} -->

              <v-spacer></v-spacer>
              <v-icon @click="dialog = false">mdi-close-circle-outline</v-icon>
            </v-toolbar>
          </v-card>
        </v-dialog>
        <!-- <v-text-field v-model="company_id" outlined dense></v-text-field>
        <v-text-field v-model="name" outlined dense></v-text-field>
        <v-text-field v-model="system_user_id" outlined dense></v-text-field> -->

        <div
          id="cameraContainer"
          class="text-center"
          style="width: 250px; height: auto; margin: 0 auto"
        >
          <video
            style="width: 100%; height: auto"
            id="camera"
            autoplay
            playsinline
          ></video>
          <br />
          <v-btn block @click="capturePhoto" color="primary">Capture</v-btn>
          <canvas id="canvas" style="display: none"></canvas>
          <v-img :src="this.imageSrc"></v-img>
        </div>
        <p id="errorMessage" style="display: none; color: red">
          Camera not found or access denied.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      system_user_id: "",
      dialog: false,
      openCameraDialog: false,
      response: "",
      cameraElement: null,
      canvasElement: null,
      errorMessageElement: null,
      imageSrc: "",
    };
  },
  mounted() {
    this.cameraElement = document.getElementById("camera");
    this.canvasElement = document.getElementById("canvas");
    this.errorMessageElement = document.getElementById("errorMessage");
    this.startCamera();
  },
  created() {
    this.name = this.$auth.user.employee.first_name;
    this.system_user_id = this.$auth.user.employee.system_user_id;
  },
  methods: {
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        }); // Use front camera
        this.cameraElement.srcObject = stream;
        this.errorMessageElement.style.display = "none";
      } catch (error) {
        console.error("Error accessing camera:", error);
        this.errorMessageElement.style.display = "block";
        document.getElementById("cameraContainer").style.display = "none";
      }
    },
    async capturePhoto() {
      this.canvasElement.width = this.cameraElement.videoWidth;
      this.canvasElement.height = this.cameraElement.videoHeight;

      this.canvasElement
        .getContext("2d")
        .drawImage(
          this.cameraElement,
          0,
          0,
          this.canvasElement.width,
          this.canvasElement.height
        );

      this.canvasElement.toBlob(async (blob) => {
        // Create a FormData object and append the image blob to it
        const formData = new FormData();
        formData.append("faceImage", await blob, "image.jpg");
        formData.append("name", this.name);
        formData.append("system_user_id", this.system_user_id);
        formData.append("company_id", this.$auth.user.company_id);

        this.$axios
          .post("https://backend.ideahrms.com/api/store-temp-image", formData)
          .then(({ data, status }) => {
            this.dialog = true;
            if (status == 200) {
              this.response = "You have been enrolled successfully";
            } else {
              this.response = "You cannot enroll";
            }
          })
          .catch((error) => console.error(error));
      }, "image/jpeg"); // Convert to JPEG format
    },
  },
};
</script>
