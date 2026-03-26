<template>
  <div>
    <h1>My Nuxt.js Page</h1>
    <p>{{ responseData }}</p>
  </div>
</template>

<script>
export default {
  layout: "guest",
  data: () => ({
    responseData: "",
  }),
  auth: false,

  created() {},
  methods: {
    verifyToken() {
      // alert(this.$route.query.token);
      if (this.$route.query.token) {
        let token = this.$route.query.token;

        token = token.replace(":" + process.env.SECRET_PASS_PHRASE, "");
        token = token; //this.$crypto.decrypt1(token);

        if (token != "" && token != "undefined") {
          this.$store.commit("login_token", token);
          let Authorization1 = "Authorization";
          let options = {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          };

          this.$axios
            .get(`me`, options, {})
            .then(({ data }) => {
              if (!data.user) {
                alert("Invalid Login Details. Please try again");
                this.$router.push(`/login`);

                return false;
              } else {
                this.$auth.setUser(data.user);

                this.$router.push(`/dashboard`);
                return false;

                if (this.$store.state.isDesktop) {
                  // window.location.href = process.env.APP_URL + "/dashboard";
                  this.$router.push(`/dashboard`);
                  return false;
                } else {
                  // window.location.href = process.env.APP_URL + "/";
                  this.$router.push(`/`);
                  return false;
                }
              }
            })
            .catch((err) => console.log(err));
        } else {
          this.$router.push(`/login`);
        }
      }
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
