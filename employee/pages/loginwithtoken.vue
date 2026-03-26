<template>
  <div>
    <div style="font-size: 25px">Loading.....please wait</div>
    <v-btn
      @click="goToLoginPage()"
      small
      class="btn btn-block fa-lg mt-1 mb-3 ml-5"
      style="background-color: #6946dd; color: #fff"
    >
      Click to Login Page
    </v-btn>
  </div>
</template>

<script>
export default {
  layout: "guest",
  data: () => ({
    responseData: "",
    email: "",
    password: "",
  }),
  auth: false,
  mounted() {
    this.verifyToken();
  },
  created() {
    //this.test();
  },
  methods: {
    goToLoginPage() {
      this.$axios.get(`/logout`).then(({ res }) => {
        this.$auth.logout();
        this.$router.push(`/login`);
      });
    },
    verifyToken() {
      if (this.$route.query.email) {
        this.email = this.$route.query.email;
        this.password = this.$route.query.password;

        this.email = decodeURIComponent(this.email);
        this.password = decodeURIComponent(this.password);

        this.email = this.$crypto.decrypt(this.email);
        this.password = this.$crypto.decrypt(this.password);

        this.loginWithOTP();
      }
    },

    loginWithOTP() {
      this.loading = true;
      //(this.$refs.form.validate());
      //if (this.$refs.form.validate())
      {
        let credentials = {
          email: this.email,
          password: this.password,
        };
        this.$store.commit("email", this.email);
        this.$store.commit("password", this.password);

        let payload = credentials;

        //geenrate OTP
        this.$axios
          .post("loginwith_otp", payload)
          .then(({ data }) => {
            if (!data.status) {
              alert("Login Details: " + data.message);
              this.login();
            } else if (data.user_id) {
              if (data.enable_whatsapp_otp == 1) {
                this.dialogWhatsapp = true;
                this.userId = data.user_id;
                if (data.mobile_number) {
                  this.maskMobileNumber = this.hideMobileNumber(
                    data.mobile_number
                  );
                }

                this.loading = false;
              } else {
                this.login();
              }
            } else {
              alert("Login Details: " + data.message);
              this.login();
            }
          })
          .catch((err) => console.log(err));
      }

      this.loading = false;
    },
    login() {
      let credentials = {
        email: this.email,
        password: this.password,
      };

      this.$auth
        .loginWith("local", { data: credentials })
        .then(({ data }) => {
          let token = data.token; //this.$crypto.encrypt1(data.token);
          this.$store.commit("login_token", token);

          if (this.$store.state.isDesktop) this.$router.push(`/dashboard`);
          else this.$router.push(`/`);
        })
        .catch(({ response }) => {
          if (!response) {
            return false;
          }
          let { status, data, statusText } = response;
          this.msg = status == 422 ? data.message : statusText;
          setTimeout(() => (this.loading = false), 2000);
        });
    },
    // async test() {
    //   try {
    //     const data = "";
    //     const response = await this.$axios.get(
    //       "https://backend.mytime2cloud.com/api/me",
    //       {
    //         headers: {
    //           Accept: "application/json",
    //           "Content-Type": "application/json",
    //           Authorization:
    //             "Bearer 781|C7TbSyJWbW2m3qolr1OdUCols0aHxMeaBQ44DO05",
    //         },
    //         params: data,
    //       }
    //     );
    //     console.log("response", response);
    //     return {
    //       responseData: JSON.stringify(response.data),
    //     };
    //   } catch (error) {
    //     console.error(error);
    //     return {
    //       responseData: "An error occurred.",
    //     };
    //   }
    // },
  },
};
</script>
