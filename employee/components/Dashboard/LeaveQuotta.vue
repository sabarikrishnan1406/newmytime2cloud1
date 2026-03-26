<template>
  <v-row v-if="leaveQuotta" no-gutters>
    <v-col>
      <v-container>
        <v-row class="pa-3">
          <v-col cols="12">
            <div>Leaves</div>
          </v-col>
          <v-col cols="12" v-if="$isDark()">
            <v-row>
              <v-col cols="2">
                <v-avatar color="accent darken-1" size="40">
                  <v-icon size="20" color="blue">mdi-beach</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.total_leave_days }}</div>
                  <div class="text-caption" style="color: #a0aec0">Total</div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="blue lighten-3"
                    color="blue lighten-1"
                    value="100"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <v-avatar color="accent darken-1" size="40">
                  <v-icon size="20" color="indigo">mdi-wallet-outline</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.balance }}</div>
                  <div class="text-caption" style="color: #a0aec0">
                    Available
                  </div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="indigo lighten-3"
                    color="indigo"
                    value="100"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <v-avatar color="accent darken-1" size="40">
                  <span class="green--text"
                    ><v-icon size="20" color="success">mdi-check</v-icon></span
                  >
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.approved }}</div>
                  <div class="text-caption" style="color: #a0aec0">
                    Approved
                  </div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="green lighten-3"
                    color="green lighten-1"
                    value="15"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <v-avatar color="accent darken-1" size="40">
                  <v-icon size="20" color="orange">mdi-clock-outline</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.pending }}</div>
                  <div class="text-caption" style="color: #a0aec0">Pending</div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="orange lighten-3"
                    color="orange lighten-1"
                    value="0"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <v-avatar color="accent darken-1" size="40">
                  <v-icon size="20" color="pink">mdi-close</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.rejected }}</div>
                  <div class="text-caption" style="color: #a0aec0">
                    Rejected
                  </div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="pink lighten-3"
                    color="pink lighten-1"
                    :value="leaveQuotta.rejected"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <v-avatar color="accent darken-1" size="40">
                  <v-icon size="20" color="grey">mdi-clock-outline</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.approved }}</div>
                  <div class="text-caption" style="color: #a0aec0">Used</div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="grey"
                    color="grey"
                    value="15"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" v-else>
            <v-row>
              <v-col cols="2">
                <v-avatar color="blue" size="40">
                  <v-icon size="20">mdi-beach</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.total_leave_days }}</div>
                  <div class="text-caption" style="color: #a0aec0">Total</div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="blue lighten-3"
                    color="blue lighten-1"
                    value="100"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <v-avatar color="indigo" size="40">
                  <v-icon size="20" color="white">mdi-wallet-outline</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.balance }}</div>
                  <div class="text-caption" style="color: #a0aec0">
                    Available
                  </div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="indigo lighten-3"
                    color="indigo"
                    value="100"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <v-avatar color="success" size="40">
                  <span class="green--text"
                    ><v-icon size="20" color="white">mdi-check</v-icon></span
                  >
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.approved }}</div>
                  <div class="text-caption" style="color: #a0aec0">
                    Approved
                  </div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="green lighten-3"
                    color="green lighten-1"
                    value="15"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <v-avatar color="orange " size="40">
                  <v-icon size="20">mdi-clock-outline</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.pending }}</div>
                  <div class="text-caption" style="color: #a0aec0">Pending</div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="orange lighten-3"
                    color="orange lighten-1"
                    value="0"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <v-avatar color="pink" size="40">
                  <v-icon size="20">mdi-close</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.rejected }}</div>
                  <div class="text-caption" style="color: #a0aec0">
                    Rejected
                  </div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="pink lighten-3"
                    color="pink lighten-1"
                    :value="leaveQuotta.rejected"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <v-avatar color="grey" size="40">
                  <v-icon size="20">mdi-clock-outline</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div style="display: flex; justify-content: space-between">
                  <div>{{ leaveQuotta.approved }}</div>
                  <div class="text-caption" style="color: #a0aec0">Used</div>
                </div>
                <div>
                  <v-progress-linear
                    background-color="grey"
                    color="grey"
                    value="15"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ["company_id", "system_user_id", "employee_id", "leave_group_id"],

  data() {
    return {
      leaveQuotta: null,
    };
  },

  computed: {
    isDarkMode() {
      return this.$isDark();
    },
  },

  watch: {
    isDarkMode() {},
  },

  methods: {
    async getTodayAttendance() {
      let options = {
        params: {
          company_id: this.company_id,
          employee_id: this.employee_id,
        },
      };

      this.$axios
        .get(
          `leave_total_quota/` + this.leave_group_id,
          options
        )
        .then(({ data }) => {
          this.leaveQuotta = data;
        });
    },

    timeToDecimal(timeStr) {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours + minutes / 60;
    },
    calculatePercentage(performed, working) {
      const performedHours = this.timeToDecimal(performed);
      const workingHours = this.timeToDecimal(working);

      const percentage = (performedHours / workingHours) * 100;

      this.gaugeSeries = [workingHours === 0 ? 0 : percentage];
    },

    timeHandler(value) {
      return value === "---" ? "00:00" : value;
    },
    getFormattedDate() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")}`;
    },
  },

  async mounted() {
    try {
      await this.getTodayAttendance();
      this.loading = false;
    } catch (error) {
      console.error("Failed to load attendance summary:", error);
    }
  },
};
</script>
