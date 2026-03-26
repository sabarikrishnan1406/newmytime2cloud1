<template>
  <v-container class="py-0">
    <v-row>
      <v-col cols="12">
        <div>Current Week Schedule</div>
      </v-col>
      <v-col cols="12" class="mb-5">
        <div
          class="fill-height"
          style="display: flex; justify-content: center; align-items: center"
        >
          <div>
            <!-- Container for heading + bar chart -->
            <div style="display: flex; align-items: center; gap: 20px">
              <!-- Heading on the left -->

              <!-- Bar chart -->
              <div
                style="
                  display: flex;
                  justify-content: center;
                  gap: 18px;
                  height: 90px;
                "
              >
                <div v-for="(item, index) in forecastData" :key="index">
                  <div
                    :title="item.availableCount"
                    style="
                      width: 10px;
                      height: 90px;
                      background: #3c4762;
                      position: relative;
                      border-radius: 50px;
                    "
                  >
                    <div
                      :title="item.bookedCount"
                      :style="`position: absolute;
                      bottom: 0;
                      width: 100%;
                      height: ${
                        item.bookedPercent > 100 ? 100 : item.bookedPercent
                      }%;
                      background: #5f42c6;
                       border-radius: 50px;
                      transition: height 0.5s ease;`"
                    ></div>

                    <div
                      style="position: absolute; bottom: -22px; font-size: 11px"
                      :style="getLabelStyle(item.label)"
                    >
                      {{ item.label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    forecastData: [
      { label: "Mon", availableCount: 50, bookedCount: 20, bookedPercent: 40 },
      { label: "Tue", availableCount: 50, bookedCount: 25, bookedPercent: 50 },
      { label: "Wed", availableCount: 50, bookedCount: 10, bookedPercent: 20 },
      { label: "Thu", availableCount: 50, bookedCount: 35, bookedPercent: 70 },
      { label: "Fri", availableCount: 50, bookedCount: 50, bookedPercent: 100 },
      { label: "Sat", availableCount: 50, bookedCount: 15, bookedPercent: 30 },
      { label: "Sun", availableCount: 50, bookedCount: 5, bookedPercent: 10 },
      { label: "Mon", availableCount: 50, bookedCount: 45, bookedPercent: 90 },
      { label: "Tue", availableCount: 50, bookedCount: 30, bookedPercent: 60 },
      { label: "Wed", availableCount: 50, bookedCount: 20, bookedPercent: 40 },
    ],
  }),
  async created() {
    // let { data } = await this.$axios.get(
    //   `ten-days-forcast/${this.$auth.user.company_id}`
    // );
    // this.forecastData = data;
  },
  methods: {
    getLabelStyle(label) {
      const leftPosition = label === "Fri" || label === "Thu" ? "20%" : "60%";
      return `
          left: -${leftPosition};
        `;
    },
  },
};
</script>
