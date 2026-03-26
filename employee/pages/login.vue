<template>
  <div class="bg-body white">
    <v-dialog persistent v-model="dialogWhatsapp" width="600px">
      <v-card :dark="false">
        <v-card-title
          dense
          class="white--text"
          style="background-color: #6946dd; !important"
        >
          Whatsapp Verification
          <v-spacer></v-spacer>
          <v-icon @click="dialogWhatsapp = false" outlined dark color="white">
            mdi mdi-close-circle
          </v-icon>
        </v-card-title>
        <v-card-text>
          <div class="row g-0">
            <div class="col-lg-12">
              <div class="p-md-5 mx-md-4">
                <v-row class="pb-5">
                  <v-col md="12" cols="12" class="text-center">
                    <h2>MyTime2Cloud</h2>
                  </v-col>
                </v-row>

                <h5>
                  Two Step Whatsapp OTP Verification
                  <v-icon dark color="green" fill>mdi-whatsapp</v-icon>
                </h5>
                <p>
                  We sent a verification code to your mobile number. Enter the
                  Code from the mobile in the filed below
                </p>
                <h2 style="font-size: 30px">
                  {{ maskMobileNumber }}
                </h2>
                <br />
                <!-- <v-form ref="form" method="post" v-model="whatsappFormValid" lazy-validation> -->
                <label
                  for=""
                  class="pb-5"
                  style="font-weight: bold; font-size: 20px"
                  >Type your 6 Digit Security Code</label
                >
                <div class="form-outline mb-4">
                  <v-otp-input
                    v-model="otp"
                    length="6"
                    :rules="requiredRules"
                  ></v-otp-input>
                </div>

                <div class="text-center pt-1 mb-5 pb-1">
                  <span v-if="msg" class="error--text">
                    {{ msg }}
                  </span>
                  <v-btn
                    :loading="loading"
                    @click="checkOTP(otp)"
                    class="btn btn-block fa-lg mt-1 mb-3"
                    style="background-color: #6946dd"
                  >
                    Verify OTP
                  </v-btn>
                  <!-- <v-btn :loading="loading" @click="checkOTP(otp)"
                      class="btn btn-primary btn-block text-white fa-lg primary mt-1 mb-3 btntext">
                      Verify OTP
                    </v-btn> -->
                </div>

                <div
                  class="d-flex align-items-center justify-content-center pb-4"
                ></div>
                <!-- </v-form> -->
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogForgotPassword" width="400px" height="500px">
      <v-card>
        <v-card-title dense class="popup_background">
          Forgot Password
          <v-spacer></v-spacer>
          <v-icon @click="dialogForgotPassword = false" outlined dark>
            mdi mdi-close-circle
          </v-icon>
        </v-card-title>
        <v-card-text>
          <ForgotPassword></ForgotPassword>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" top="top" color="error" elevation="24">
      {{ snackbarMessage }}
    </v-snackbar>

    <v-row class="" style="height: 100%">
      <v-col xs="12" sm="12" md="12" lg="5" style="padding: 0px">
        <div
          class="p-md-5"
          style="
            padding: 3rem !important;
            max-width: 500px;
            margin: auto;
            text-align: center;
          "
        >
          <div style="min-height: 100px">
            <div style="width: 100%" class="text-center">
              <v-img
                class="text-center"
                style="
                  width: 200px;
                  padding: 0px;
                  margin: auto;
                  text-align: center;
                "
                src="/logo22.png"
              ></v-img>
            </div>
            <h3 class="pb-7 pt-15 black--text">
              Welcome To
              <span style="font-size: 20px"> Mytime2Cloud </span>
            </h3>
          </div>
          <div>
            <v-form
              ref="form"
              method="post"
              v-model="valid"
              lazy-validation
              autocomplete="off"
            >
              <div class="form-outline">
                <v-text-field
                  light
                  role="presentation"
                  label="Email"
                  v-model="credentials.email"
                  :hide-details="false"
                  id="form2Example11"
                  autofill="false"
                  required
                  dense
                  outlined
                  type="email"
                  prepend-inner-icon="mdi-account"
                  append-icon="mdi-at"
                  autocomplete="off"
                  aria-autocomplete="none"
                ></v-text-field>
              </div>

              <div class="form-outline">
                <v-text-field
                  light
                  role="presentation"
                  label="Password"
                  dense
                  outlined
                  autocomplete="off"
                  prepend-inner-icon="mdi-lock  "
                  :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show_password ? 'text' : 'password'"
                  v-model="credentials.password"
                  class="input-group--focused"
                  @click:append="show_password = !show_password"
                ></v-text-field>
              </div>

              <v-row no-gutters>
                <v-col cols="6">
                  <v-checkbox
                    class="pa-0 ma-0"
                    v-model="rememberMe"
                    label="Remember Me"
                  />
                </v-col>
                <v-col cols="6" class="text-right" style="margin-top: 4px">
                  <label
                    @click="openForgotPassword"
                    class="v-label theme--light"
                    >Forgot password?</label
                  >
                </v-col>
              </v-row>

              <div class="text-center pt-1 mb-5 pb-1">
                <span v-if="msg" class="error--text111" style="color: #ff9f87">
                  {{ msg }}
                </span>
                <v-btn
                  :loading="loading"
                  @click="login"
                  class="btn primary btn-black btn-block mt-1 mb-3 p-4 btntext"
                  style="width: 100%; height: 48px"
                >
                  Login
                </v-btn>
              </div>
            </v-form>
          </div>
          <div class="text-center black--text">
            Don't Have an Account?. Contact Admin
          </div>

          <v-row class="text-center black--text" style="font-size: 13px">
            <v-col class="pa-5">
              For Technical Support :
              <a
                target="_blank"
                href="https://wa.me/971529048025?text=Hello MyTime2Cloud. I need your support."
                ><v-icon color="black">mdi-whatsapp</v-icon></a
              >
              <a
                style="text-decoration: none; color: black"
                href="tel:+971529048025"
                >+971 52 904 8025</a
              ></v-col
            >
          </v-row>
          <v-row class="text-center" style="font-size: 13px">
            <v-col class="pa-5">
              <a
                style="text-decoration: none; color: black"
                href="mailto:support@mytime2cloud.com"
                >support@mytime2cloud.com</a
              ></v-col
            >
          </v-row>
        </div>
      </v-col>
      <v-col
        xs="12"
        sm="12"
        md="12"
        lg="7"
        style=""
        class="hide-on-mobile d-none d-lg-flex"
      >
        <div class="about-content">
          <h3>About Mytime2Cloud</h3>
          <div style="font-weight: 300">
            MyTime2Cloud is an innovative and comprehensive platform
            meticulously crafted to redefine how organizations approach
            workforce management. By combining time attendance management with
            facial recognition access control, MyTime2Cloud simplifies and
            provides a streamlined experience for both employees and HR
            professionals.<br />
            Customization and Reporting: The platform offers customizable
            settings to fit the specific needs of different organizations. It
            generates comprehensive reports and analytics based on attendance
            data, enabling informed decision-making and efficient resource
            allocation.
          </div>
          <h3 class="pt-10">Features</h3>
          <ul style="font-weight: 300">
            <li>Employees management</li>

            <li>Time Attendance</li>
            <li>Leave management</li>
            <li>Payroll management</li>
            <li>Access Controll</li>
            <li>Visitor management</li>
            <li>Face Recognisation Integration</li>
            <li>Custom Reports</li>
            <li>Custom Dashboards</li>
            <li>Email and Whatsapp Notifications</li>
          </ul>
          <v-row class="text-left pt-10">
            <v-col class="pa-5">
              <h3>Technical Support</h3>

              <a
                style="font-weight: 300; color: white"
                target="_blank"
                href="https://wa.me/971529048025?text=Hello MyTime2Cloud. I need your support."
                ><v-icon color="white">mdi-whatsapp</v-icon></a
              >

              <a
                style="text-decoration: none; font-weight: 300; color: white"
                href="tel:+971529048025"
                >+971 52 904 8025</a
              >
              <br />
              <a
                style="text-decoration: none; font-weight: 300;color: white"
                href="mailto:support@mytime2cloud.com"
                >support@mytime2cloud.com</a
              >
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ForgotPassword from "../components/ForgotPassword.vue";
export default {
  layout: "login",
  components: { ForgotPassword },
  data: () => ({
    dialogForgotPassword: false,
    maskMobileNumber: "",
    whatsappFormValid: true,
    logo: "/ideaHRMS-final-blue.svg",
    valid: true,
    loading: false,
    snackbar: false,
    snackbarMessage: "",
    rememberMe: false,
    show_password: false,
    msg: "",
    requiredRules: [(v) => !!v || "Required"],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],

    passwordRules: [(v) => !!v || "Password is required"],

    dialogWhatsapp: false,
    otp: "",
    userId: "",
    credentials: {
      email: "",
      password: "",
    },
  }),
  created() {
  },
  mounted() {
    if (this.$localStorage.get("email")) {
      this.credentials.email = this.$localStorage.get("email");
    }
    if (this.$localStorage.get("password")) {
      this.credentials.password = this.$localStorage.get("password");
    }

    if (this.$localStorage.get("email") && this.$localStorage.get("password")) {
      this.rememberMe = true;
    }
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000 * 60 * 15); //15 minutes
  },
  methods: {
    openForgotPassword() {
      this.dialogForgotPassword = true;
    },
   
    hideMobileNumber(inputString) {
      // Check if the input is a valid string
      if (typeof inputString !== "string" || inputString.length < 4) {
        return inputString; // Return input as is if it's not a valid string
      }

      // Use a regular expression to match all but the last 3 digits
      var regex = /^(.*)(\d{5})$/;
      var matches = inputString.match(regex);

      if (matches) {
        var prefix = matches[1]; // Text before the last 3 digits
        var lastDigits = matches[2]; // Last 3 digits
        var maskedPrefix = "*".repeat(prefix.length); // Create a string of asterisks of the same length as the prefix
        return maskedPrefix + lastDigits;
      } else {
        return inputString; // Return input as is if there are fewer than 3 digits
      }
    },

    handleInputChange() {},
    // mxVerify(res) {
    //   this.reCaptcha = res;
    //   this.showGRC = this.reCaptcha ? false : true;
    // },
    checkOTP(otp) {
      if (otp == "") {
        alert("Enter OTP");
        return;
      }
      let payload = {
        userId: this.userId,
      };
      this.$axios
        .post(`check_otp/${otp}`, payload)
        .then(({ data }) => {
          if (!data.status) {
            alert("Invalid OTP. Please try again");
          } else {
            this.login();
          }
        })
        .catch((err) => console.log(err));
    },
    login() {
      if (this.$refs.form.validate()) {
        this.$store.commit("email", this.credentials.email);
        this.$store.commit("password", this.credentials.password);

        this.msg = "";
        this.loading = true;
        this.$auth
          .loginWith("local", { data: this.credentials })
          .then(({ data }) => {
            // if (
            //   this.$auth.user.role_id == 0 &&
            //   this.$auth.user.user_type == "employee"
            // ) {
            //   window.location.href = process.env.EMPLOYEE_APP_URL;
            //   return "";
            // }

            setTimeout(() => (this.loading = false), 2000);
          })
          .catch(({ response }) => {
            if (!response) {
              return false;
            }
            let { status, data, statusText } = response;
            this.msg = status == 422 ? data.message : statusText;
            setTimeout(() => (this.loading = false), 2000);
          });
      } else {
        this.snackbar = true;
        this.snackbarMessage = "Invalid Emaild and Password";
      }
    },
  },
};
</script>
<style>
body,
html {
  height: 100%;
}

.bg-body {
  padding-top: 5%;

  height: 100%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

<style scoped>
.about-content {
  padding-left: 30%;
  padding-top: 1%;

  padding-right: 15%;
}
.btntext {
  color: #6946dd;
  font-weight: bold;
  font-size: 22px;
}
@media (max-width: 1200px) {
  .hide-on-mobile {
    display: none;
  }
}
@media (min-width: 1300px) {
  .bg-body {
    background-image: url("../static/login/bgimage3.png") !important;
  }
  .gradient-form {
    height: 100vh !important;
  }

  .bgimage2 {
    background-image: url("../static/login/bgimage.png");
    background-size: cover;
  }

  .loginForm {
    width: 100%;
    position: absolute;
    top: 10%;
    left: 5%;
  }
}
@media (max-width: 700px) {
  .hide-on-mobile {
    display: none;
  }

  .loginForm {
    width: 100%;
    position: absolute;
    top: 10%;
    left: 0%;
  }
  body {
    width: 100%;
    max-width: 100%;
    background-color: #6946dd;
  }
}
</style>
