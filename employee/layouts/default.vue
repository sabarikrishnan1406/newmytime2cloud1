<template>
  <span>
    <style>
      * {
        font-size: 13px;
      }
      .v-dialog.v-dialog--active {
        box-shadow: none !important;
      }
      .dark-background {
        background: #1a202e !important;
        color: #fff !important;
      }

      .light-background {
        background: #fff !important;
        color: #000000 !important;
      }

      .v-expansion-panel {
        background: none !important;
      }
      .custom-light-header-for-datatable th {
        background-color: #fff !important;
        color: grey !important;
        border-bottom: 1px solid grey !important;
      }
      .custom-dark-header-for-datatable th {
        background-color: #272f42 !important;
        color: white !important;
      }

      .v-picker__body.v-picker__body.theme--dark {
        background: none !important;
      }

      .v-btn__content {
        color: black !important;
      }

      .v-date-picker-header__value .accent--text button {
        color: black !important;
      }

      /* Dark mode overrides */
      .dark-mode .v-btn__content {
        color: white !important;
      }

      .dark-mode .v-date-picker-header__value .accent--text button {
        color: white !important;
      }

      .v-sheet.theme--dark.logout {
        background: #1a202e !important;
      }

      .v-sheet.theme--dark.alert {
        background: #1a202e !important;
      }

      .dark-mode-btn .v-btn__content {
        color: white !important;
      }

      .light-mode-btn .v-btn__content {
        color: white !important;
      }
    </style>
    <v-app :class="$isDark() ? 'dark-background' : 'light-background'">
      <v-navigation-drawer dark v-model="drawer" app class="background">
        <v-list>
          <template v-for="(item, i) in loadMenus">
            <v-list-item
              v-if="item.show_mobile_app != miniVariant"
              :key="i"
              :to="item.to"
              :style="'color:' + item.color"
              router
              exact
            >
              <v-list-item-action>
                <v-icon :style="'color:' + item.color">{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar
        :class="$isDark() ? 'dark-background' : 'light-background'"
        dense
        app
      >
        <span class="text-overflow d-flex align-center">
          <v-btn icon @click.stop="drawer = !drawer">
            <v-icon :color="$isDark() ? 'white' : 'black'">mdi-menu</v-icon>
          </v-btn>
          <img title="My Time Cloud" :src="`/logo22.png`" style="width: 86px" />
        </span>

        <v-spacer />
        <v-btn icon @click="toggleTheme">
          <v-icon :color="$isDark() ? 'white' : 'black'">
            {{
              $isDark() ? "mdi-white-balance-sunny" : "mdi-moon-waning-crescent"
            }}
          </v-icon>
        </v-btn>
        <v-icon class="mx-2" v-if="!unreads.length" color="grey"
          >mdi-bell</v-icon
        >

        <v-menu v-else offset-y v-model="menuOpen">
          <template v-slot:activator="{ on }">
            <v-badge
              class="mx-1"
              overlap
              color="red"
              :content="notificationCount"
            >
              <v-icon v-on="on" color="primary">mdi-bell</v-icon>
            </v-badge>
          </template>
          <v-list dense>
            <v-list-item-group>
              <v-list-item
                v-for="({ id, redirect_url, data }, index) in unreads"
                :key="index"
              >
                <!-- <v-list-item-icon>
                <v-icon color="primary">mdi-bell</v-icon>
              </v-list-item-icon> -->
                <v-list-item-content>
                  <v-list-item-title
                    @click="updateNotificationStatus(id, redirect_url)"
                    color="primary"
                    >{{ data }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>

        <v-menu
          class="avatar-menu"
          nudge-bottom="50"
          transition="scale-transition"
          origin="center center"
          bottom
          right
          min-width="20"
          nudge-right="0"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="red" v-bind="attrs" v-on="on">
              <v-avatar size="35" style="border: 1px solid #6946dd">
                <v-img :src="profile_picture" />
              </v-avatar>
            </v-btn>
          </template>

          <v-list class="avatar-menu logout" :light="!$isDark()">
            <v-list-item-group color="primary">
              <v-list-item
                v-if="
                  $auth.user.user_type == 'branch' &&
                  this.$store.state.isDesktop
                "
                @click="changeLoginType"
              >
                <v-list-item-icon>
                  <v-icon>mdi-account-multiple-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="black--text">
                    Login Into Branch
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-app-bar>
      <v-main>
        <v-container fluid class="pa-7">
          <Nuxt />
        </v-container>
      </v-main>
    </v-app>
  </span>
</template>

<script>
export default {
  // components: { Location },

  name: "DefaultLayout",
  data() {
    return {
      notificationCount: 0,
      menuOpen: false,
      profile_picture: "/no-profile-image.jpg",
      clipped: false,
      drawer: false,
      fixed: false,
      menus: [],

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Mytime",
      unreads: [],
      interval: 0,
    };
  },
  async created() {
    setTimeout(() => {
      if (this.$auth.user && this.$auth.user.employee) {
        this.profile_picture =
          this.$auth.user.employee.profile_picture || "/no-profile-image.jpg";
      } else {
        // User is not authenticated or doesn't have an employee object
        // You might want to handle this case or log a message
        this.logout();
      }
    }, 500);

    // this.verifyToken();
    // if (this.$store.state.isDesktop) {
    //   this.$router.push(`/dashboard`);
    // }
    await this.getUnReads();

    this.interval = setInterval(this.getUnReads, 30000);
  },
  beforeDestroy() {
    // Clear the interval when the component is destroyed
    clearInterval(this.interval);
  },
  mounted() {
    if (window.innerWidth >= 600) {
      this.drawer = true;
      this.miniVariant = true;
    } else {
      this.miniVariant = false;
    }
    this.$store.commit("isDesktop", this.miniVariant);

    this.$store.dispatch("theme/loadTheme");
    this.$vuetify.theme.dark = this.$isDark();
  },
  computed: {
    locationData() {
      return this.$store.state.locationData;
    },
    loadMenus() {
      return [
        {
          icon: "mdi-apps",
          title: "Home",
          to: "/",
          color: "#9aa9b9",
          show_mobile_app: true,
        },
        {
          icon: "mdi-apps",
          title: "Dashboard",
          to: "/dashboard",
          color: "#9aa9b9",
          show_mobile_app: false,
        },
        {
          icon: "mdi-map-marker-radius",
          title: "GPS History",
          to: "/history",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-clipboard-text",
          title: "Change Requests",
          to: "/change_requests",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-transit-transfer",
          title: "Visitor Requests",
          to: "/visitor_requests",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "Logs",
          to: "/logs",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-calendar-account",
          title: "Attendance",
          to: "/attendance",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-calendar-minus",
          title: "Leaves",
          to: "/leaves",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-cash",
          title: "Payslips",
          to: "/payslips",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-timetable",
          title: "Schedules",
          to: "/schedules",
          color: "#9aa9b9",
        },
        // {
        //   icon: "mdi-account-tie",
        //   title: "Access Devices",
        //   to: "/access_control",
        //   color: "#9aa9b9",
        // },
        {
          icon: "mdi-calendar-badge-outline",
          title: "Leave Quota",
          to: "/leave_quota",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-bell-badge",
          title: "Announcements",
          to: "/announcements",
          color: "#9aa9b9",
        },

        {
          icon: "mdi-calendar-star",
          title: "Holidays",
          to: "/holidays",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-account-tie",
          title: "Profile",
          to: "/profile",
          color: "#9aa9b9",
        },
        {
          icon: "mdi-logout",
          title: "Logout",
          to: "/logout",
          color: "#f36c6c",
        },
      ];
    },
  },
  methods: {
    toggleTheme() {
      this.$store.dispatch("theme/toggleTheme");
    },
    can(per) {
      return this.$auth.user.permissions.includes(per) || per === "/"
        ? true
        : false;
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },

    changeLoginType() {
      try {
        let email = this.$store.state.email;
        let password = this.$store.state.password;

        email = this.$crypto.encrypt(email);
        password = this.$crypto.encrypt(password);

        email = encodeURIComponent(email);
        password = encodeURIComponent(password);

        if (email && password) {
          window.location.href =
            process.env.ADMIN_APP_URL +
            "/loginwithtoken?email=" +
            email +
            "&password=" +
            password;

          return "";
        }
        // this.$router.push("/employees/profile");
      } catch (e) {
        console.log(e);
      }
    },

    logout() {
      this.$axios.get(`/logout`).then(({ res }) => {
        this.$auth.logout();
        this.$router.push(`/login`);
      });
    },
    updateNotificationStatus(id, redirect_url) {
      this.$axios
        .put(`/update/${id}`, {
          params: {
            company_id: this.$auth.user.company_id,
            user_id: this.$auth.user.id,
          },
        })
        .then(({ data }) => {
          this.getUnReads();
          this.$router.push(redirect_url);
        });
    },

    async getUnReads() {
      try {
        const { id, employee } = await this.$auth.user;

        const { data } = await this.$axios.get(`unread`, {
          params: {
            company_id: employee.company_id,
            user_id: id,
          },
        });

        this.unreads = data;
        this.notificationCount = data.length;
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    },
  },
};
</script>
