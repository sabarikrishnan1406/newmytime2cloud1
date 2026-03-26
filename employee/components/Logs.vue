<template>
  <span>
    <v-row class="pa-2">
      <v-col cols="12" md="10">Logs</v-col>
      <v-col cols="12" md="2">
        <div class="text-right mr-5">
          <Calender @filter-attr="filterAttr" />
        </div>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :class="
            $isDark()
              ? 'accent custom-dark-header-for-datatable'
              : 'light-background custom-light-header-for-datatable'
          "
          :mobile-breakpoint="$store.state.isDesktop ? 0 : 2000"
          dense
          :headers="headers_table"
          :items="data"
          model-value="data.id"
          :loading="loading"
          :options.sync="options"
          :footer-props="{
            itemsPerPageOptions: [10, 50, 100, 500, 1000],
          }"
          :server-items-length="totalRowsCount"
          fixed-header
          :disable-sort="true"
        >
          <template v-slot:item.sno="{ item, index }">
            {{ index + 1 }}
          </template>
          <template v-slot:item.employee="{ item, index }">
            <v-row no-gutters>
              <v-col
                style="
                  padding: 5px;
                  padding-left: 0px;
                  width: 40px;
                  max-width: 40px;
                "
              >
                <v-img
                  style="
                    border-radius: 50%;
                    height: auto;
                    width: 40px;
                    max-width: 40px;
                  "
                  :src="
                    item.employee && item.employee.profile_picture
                      ? item.employee.profile_picture
                      : '/no-profile-image.jpg'
                  "
                >
                </v-img>
              </v-col>
              <v-col style="padding: 10px">
                <span class="ml-2" small>
                  {{ item.employee.first_name ?? "---" }}
                </span>
                <div class="secondary-value ml-2">
                  {{ item.employee?.designation?.name }}
                </div>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.device.name="{ item }">
            {{ item.device ? caps(item.device.name) : "---" }}
          </template>
          <template v-slot:item.mode="{ item }">
            <v-icon
              :color="$isDark() ? 'white' : 'black'"
              v-if="item.DeviceID?.includes(`Mobile`)"
              >mdi-cellphone</v-icon
            >
            <span v-else>
              <v-avatar
                v-for="(icon, index) in getRelatedIcons(item.mode)"
                :key="index"
                class="mx-1"
                tile
                size="20"
                ><img style="width: 100%" :src="icon"
              /></v-avatar>
            </span>
          </template>
          <template v-slot:item.gps_location="{ item }">
            {{ item.gps_location || "---" }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </span>
</template>

<script>
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const today = new Date();

const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

// import DateRangePicker from "../components/Snippets/Filters/DateRangePicker.vue";
import Calender from "../components/Calender.vue";
export default {
  components: {
    Calender,
  },
  data: () => ({
    perPage: 10,
    currentPage: 1,
    options: {
      current: 1,
      total: 0,
      itemsPerPage: 10,
    },

    tableHeight: 750,
    id: "",
    from_menu_filter: "",
    from_date_filter: "",

    showFilters: false,
    filters: {},
    isFilter: false,
    generateLogsDialog: false,
    totalRowsCount: 0,
    //server_datatable_totalItems: 10,
    datatable_search_textbox: "",
    datatable_searchById: "",
    filter_employeeid: "",
    snack: false,
    snackColor: "",
    snackText: "",
    departments: [],
    Model: "Log",
    endpoint: "attendance_logs",

    from_date: new Date().toISOString().split("T")[0],
    from_menu: false,
    to_date: new Date().toISOString().split("T")[0],
    to_menu: false,

    payload: {},

    loading: true,

    date: null,
    menu: false,

    loading: false,
    time_menu: false,
    ids: [],

    data: [],
    devices: [],
    total: 0,
    pagination: {
      current: 1,
      total: 0,
      itemsPerPage: 1000,
    },
    payloadOptions: {},

    errors: [],
    response: "",
    snackbar: false,
    headers_table: [
      {
        text: "Info",
        align: "left",
        sortable: false,
        key: "date_range",
        value: "employee",
        fieldType: "date_range_picker",
      },
      {
        text: "Date",
        align: "left",
        sortable: false,
        key: "date_range",
        value: "date",
        fieldType: "date_range_picker",
      },
      {
        text: "Time",
        align: "left",
        sortable: false,
        key: "date_range",
        value: "time",
        fieldType: "date_range_picker",
      },
      {
        text: "Device Name",
        align: "left",
        sortable: true,
        key: "device",
        value: "device.name",
        filterable: true,
        filterSpecial: true,
      },
      {
        text: "Mode",
        align: "left",
        sortable: true,
        key: "mode",
        value: "mode",
        filterable: true,
        filterSpecial: true,
      },
      {
        text: "Gps Location",
        align: "left",
        sortable: true,
        key: "gps_location",
        value: "gps_location",
        filterable: true,
        filterSpecial: true,
      },
    ],
    payload: {
      from_date: formatDate(firstDay),
      to_date: formatDate(lastDay),
    },
  }),

  mounted() {
    this.tableHeight = window.innerHeight - 270;
    window.addEventListener("resize", () => {
      this.tableHeight = window.innerHeight - 270;
    });
  },
  created() {
    this.loading = true;
    this.getLogs();
  },
  watch: {
    options: {
      handler() {
        this.getLogs();
      },
      deep: true,
    },
  },
  methods: {
    getRelatedIcons(mode) {
      let iconPath = "/icons/employee-access/";
      let colorMode = this.$isDark() ? "w" : "b"; // b = black, w = white
      const icons = {
        Card: [iconPath + "3-" + colorMode + ".png"],
        Fing: [iconPath + "4-" + colorMode + ".png"],
        Face: [iconPath + "1-" + colorMode + ".png"],
        "Fing + Card": [
          iconPath + "1-" + colorMode + ".png",
          iconPath + "3-" + colorMode + ".png",
        ],
        "Face + Fing": [
          iconPath + "1-" + colorMode + ".png",
          iconPath + "4-" + colorMode + ".png",
        ],
        "Face + Card": [
          iconPath + "1-" + colorMode + ".png",
          iconPath + "3-" + colorMode + ".png",
        ],
        "Card + Pin": [
          iconPath + "3-" + colorMode + ".png",
          iconPath + "2-" + colorMode + ".png",
        ],
        "Face + Pin": [
          iconPath + "1-" + colorMode + ".png",
          iconPath + "2-" + colorMode + ".png",
        ],
        "Fing + Pin": [
          iconPath + "4-" + colorMode + ".png",
          iconPath + "2-" + colorMode + ".png",
        ],
        "Fing + Card + Pin": [
          iconPath + "4-" + colorMode + ".png",
          iconPath + "3-" + colorMode + ".png",
          iconPath + "2-" + colorMode + ".png",
        ],
        "Face + Card + Pin": [
          iconPath + "1-" + colorMode + ".png",
          iconPath + "3-" + colorMode + ".png",
          iconPath + "2-" + colorMode + ".png",
        ],
        "Face + Fing + Pin": [
          iconPath + "1-" + colorMode + ".png",
          iconPath + "4-" + colorMode + ".png",
          iconPath + "2-" + colorMode + ".png",
        ],
        "Face + Fing + Card": [
          iconPath + "1-" + colorMode + ".png",
          iconPath + "4-" + colorMode + ".png",
          iconPath + "3-" + colorMode + ".png",
        ],
        Manual: [], // assuming no icons for Manual
        Repeated: [], // assuming no icons for Repeated
      };

      return icons[mode] || [iconPath + "2-" + colorMode + ".png"];
    },
    filterAttr(data) {
      this.payload.from_date = data.from;
      this.payload.to_date = data.to;
      this.payload.from_date_txt = data.from;
      this.payload.to_date_txt = data.to;

      this.getLogs();
    },
    handleDatesFilter(dates) {
      if (dates.length > 1) {
        this.getLogs(this.endpoint, "dates", dates);
      }
    },

    applyFilters() {
      this.getLogs();
      this.from_menu_filter = false;
      this.to_menu_filter = false;
    },
    toggleFilter() {
      // this.filters = {};
      this.isFilter = !this.isFilter;
    },
    clearFilters() {
      this.filters = {};

      this.isFilter = false;
      this.getLogs();
    },
    caps(str) {
      if (str == "" || str == null) {
        return "---";
      } else {
        let res = str.toString();
        return res.replace(/\b\w/g, (c) => c.toUpperCase());
      }
    },
    getDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    getRecords(filter_column = "", filter_value = "") {
      this.filters = {};
      this.isFilter = false;
      if (filter_value != "" && filter_value.length <= 2) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Minimum 3 Characters to filter ";
        this.loading = false;
        return false;
      }
      this.getLogs(this.endpoint, filter_column, filter_value);
    },
    getLogs(url = this.endpoint, filter_column = "", filter_value = "") {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let sortedBy = sortBy ? sortBy[0] : "";
      let sortedDesc = sortDesc ? sortDesc[0] : "";

      this.payloadOptions = {
        params: {
          page: page,
          sortBy: sortedBy,
          sortDesc: sortedDesc,
          per_page: itemsPerPage,
          company_id: this.$auth.user.company_id,
          UserID: this.$auth.user.employee.system_user_id,

          ////department_ids: this.$auth.user.assignedDepartments,
          ...this.payload,
          ...this.filters,
        },
      };
      if (filter_column != "")
        this.payloadOptions.params[filter_column] = filter_value;
      this.loading = true;
      this.$axios.get(url, this.payloadOptions).then(({ data }) => {
        // if (filter_column != "" && data.data.length == 0) {
        //   this.snack = true;
        //   this.snackColor = "error";
        //   this.snackText = "No Results Found";
        //   this.loading = false;
        //   return false;
        // }
        //this.server_datatable_totalItems = data.total;
        this.data = data.data;
        this.total = data.total;
        this.loading = false;
        this.totalRowsCount = data.total;

        this.currentPage = page;
        this.perPage = itemsPerPage;
      });
    },
  },
};
</script>
