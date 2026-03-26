<template>
  <SnippetsCard class="px-5">
    <template #body>
      <v-row>
        <v-col> Attendance Reports </v-col>
        <v-col cols="12" md="3" class="text-right">
          <div style="display: flex; justify-content: right">
            <div class="mx-2" style="height: 10px;width: 100%;">
              <Calender @filter-attr="filterAttr" />
            </div>
            <v-btn
              @click="commonMethod()"
              dense
              small
              color="primary"
              primary
              fill
              >Submit
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="12">
          <AttendanceReport
            v-if="$auth.user.employee?.schedule_active?.shift_type_id == 2"
            :key="3"
            title="Multi In/Out Reports"
            shift_type_id="2"
            :headers="multiHeaders"
            :report_template="report_template"
            :payload1="payload11"
            process_file_endpoint="multi_in_out_"
            render_endpoint="render_multi_inout_report"
          />
          <AttendanceReport
            v-else-if="$auth.user.employee?.schedule_active?.shift_type_id == 5"
            title="Split Reports"
            shift_type_id="5"
            :headers="doubleHeaders"
            :report_template="report_template"
            :payload1="payload11"
            process_file_endpoint="multi_in_out_"
            render_endpoint="render_multi_inout_report"
            :key="2"
            ref="profile"
          />

          <AttendanceReport
            v-else
            :key="1"
            title="General Reports"
            shift_type_id="1"
            :headers="generalHeaders"
            :report_template="report_template"
            :payload1="payload11"
            process_file_endpoint=""
            render_endpoint="render_general_report"
          />
        </v-col>
      </v-row>
      <!-- <Back class="primary white--text" /> -->
    </template>
  </SnippetsCard>
</template>
<script>
import AttendanceReport from "../components/Attendance/reportComponent.vue";
import Calender from "../components/Calender.vue";

import generalHeaders from "../defaults/headers/general.json";
import multiHeaders from "../defaults/headers/multi.json";
import doubleHeaders from "../defaults/headers/double.json";

export default {
  components: { AttendanceReport, Calender },

  props: ["title", "shift_type_id", "render_endpoint", "process_file_endpoint"],

  data: () => ({
    key: 1,
    payload11: {},
    selectAllDepartment: false,
    branches: [],
    tab: null,
    generalHeaders,
    multiHeaders,
    doubleHeaders,
    filters: {},
    attendancFilters: false,
    isFilter: false,
    datatable_search_textbox: "",
    datatable_filter_date: "",
    filter_employeeid: "",
    snack: false,
    snackColor: "",
    snackText: "",
    date: null,
    menu: false,
    selectedItems: [],
    time_table_dialog: false,
    log_details: false,
    overtime: false,
    options: {},
    date: null,
    menu: false,
    loading: false,
    time_menu: false,
    manual_time_menu: false,
    Model: "Attendance Reports",
    endpoint: "report",
    search: "",
    snackbar: false,
    add_manual_log: false,
    dialog: false,
    generateLogsDialog: false,
    reportSync: false,
    from_date: null,
    from_menu: false,
    to_date: null,
    to_menu: false,
    ids: [],
    departments: [],
    scheduled_employees: [],
    DateRange: true,
    devices: [],
    valid: true,
    nameRules: [(v) => !!v || "reason is required"],
    timeRules: [(v) => !!v || "time is required"],
    deviceRules: [(v) => !!v || "device is required"],
    daily_menu: false,
    daily_date: null,
    dailyDate: false,
    editItems: {
      attendance_logs_id: "",
      UserID: "",
      device_id: "",
      user_id: "",
      reason: "",
      date: "",
      time: null,
      manual_entry: false,
    },
    loading: false,
    total: 0,

    report_template: "Template1",
    report_type: "monthly11111111",
    payload: {
      from_date: null,
      to_date: null,
      daily_date: null,
      employee_id: "",
      department_ids: [{ id: "-1", name: "" }],
      status: "-1",
    },
    log_payload: {
      user_id: null,
      device_id: "",
      date: null,
      time: null,
    },
    log_list: [],
    snackbar: false,
    editedIndex: -1,
    editedItem: { name: "" },
    defaultItem: { name: "" },
    response: "",
    data: [],
    shifts: [],
    errors: [],
    custom_options: {},
    statuses: [
      {
        name: `All Status`,
        id: `-1`,
      },
      {
        name: `Present`,
        id: `P`,
      },
      {
        name: `Absent`,
        id: `A`,
      },
      {
        name: `Missing`,
        id: `M`,
      },
      {
        name: `Late In`,
        id: `LC`,
      },
      {
        name: `Early Out`,
        id: `EG`,
      },
      {
        name: `Off`,
        id: `O`,
      },
      {
        name: `Leave`,
        id: `L`,
      },
      {
        name: `Holiday`,
        id: `H`,
      },
      {
        name: `Vaccation`,
        id: `V`,
      },
      {
        name: `Manual Entry`,
        id: `ME`,
      },
    ],
    max_date: null,
    filter_type_items: [
      {
        id: 1,
        name: "Today",
      },
      {
        id: 2,
        name: "Yesterday",
      },
      {
        id: 3,
        name: "This Week",
      },
      {
        id: 4,
        name: "This Month",
      },
      {
        id: 5,
        name: "Custom",
      },
    ],
    isCompany: true,
    tabSwitcherCount: 0,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New" : "Edit";
    },
    isIndeterminateDepartment() {
      return (
        this.payload.department_ids.length > 0 &&
        this.payload.department_ids.length < this.departments.length
      );
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      this.errors = [];
      this.search = "";
    },
    selectAllDepartment(value) {
      if (value) {
        this.payload.department_ids = this.departments.map((e) => e.id);
      } else {
        this.payload.department_ids = [];
      }
    },

    // tab(value) {
    //   this.payload11 = {
    //     ...this.payload,
    //     tabid: value,
    //   };
    //   this.commonMethod();
    // },
  },
  async created() {
    this.loading = true;
    // this.setMonthlyDateRange();
    this.payload.daily_date = new Date().toJSON().slice(0, 10);
    this.payload.department_ids = [];
    if (this.$auth.user.assignedDepartments)
      this.payload.department_ids = this.$auth.user.assignedDepartments;

    let options = {
      params: {
        per_page: 1000,
        company_id: this.$auth.user.company_id,
        //department_ids: this.$auth.user.assignedDepartments,
      },
    };

    setTimeout(() => {
      this.getBranches();
      this.getScheduledEmployees();
      this.getDeviceList(options);
    }, 3000);

    let dt = new Date();
    let y = dt.getFullYear();
    let m = dt.getMonth() + 1;
    let dd = new Date(dt.getFullYear(), m, 0);

    m = m < 10 ? "0" + m : m;

    this.payload.from_date = `${y}-${m}-01`;
    this.payload.from_date = `${y}-${m}-${dd.getDate()}`;
    this.payload.to_date = `${y}-${m}-${dd.getDate()}`;
    setTimeout(() => {
      this.getDepartments(options);
      this.commonMethod();
    }, 1000);
  },

  methods: {
    toggleDepartmentSelection() {
      this.selectAllDepartment = !this.selectAllDepartment;
    },
    filterAttr(data) {
      this.from_date = data.from;
      this.to_date = data.to;
      this.filterType = "Monthly"; // data.type;

      //this.search = data.search;
      // if (this.from_date && this.to_date) this.commonMethod();
    },

    commonMethod(id = 0) {
      let filterDay = this.filter_type_items.filter(
        (e) => e.id == this.filterType
      );
      if (filterDay[0]) {
        if (filterDay[0].name == "Today") this.report_type = "Daily";
        else filterDay = filterDay[0].name;
      }

      if (filterDay == "") {
        filterDay = "Daily";
      }

      this.payload11 = {
        ...this.payload,
        report_type: "Monthly", //filterDay,
        tabselected: this.tab,
        from_date: this.from_date,
        to_date: this.to_date,
        filterType: this.filterType,
        key: this.key++,
        employee_id: this.$auth.user.employee.system_user_id,
      };

      if (this.tabSwitcherCount == 0) {
        setTimeout(() => {
          this.tab = "tab-2";
        }, 2000);
        setTimeout(() => {
          this.tab = "tab-3";
        }, 3000);
        setTimeout(() => {
          this.tab = "tab-1";
        }, 4000);
        this.tabSwitcherCount++;
      }
    },
    getFirstAndLastDay() {
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      const last = new Date(year, month, 0)
        .getDate()
        .toString()
        .padStart(2, "0");

      let firstDay = `${year}-${month}-0${1}`;

      let lastDayFirst = last > 9 ? `${last}` : `0${last}`;

      let lastDay = `${year}-${month}-${lastDayFirst}`;

      return [firstDay, lastDay];
    },
    week() {
      const today = new Date();
      const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      const startOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - dayOfWeek
      );
      const endOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        startOfWeek.getDate() + 6
      );

      return [
        startOfWeek.toISOString().slice(0, 10),
        endOfWeek.toISOString().slice(0, 10),
      ];
    },

    getScheduledEmployees() {
      let options = {
        params: {
          per_page: 1000,
          company_id: this.$auth.user.company_id,
          department_ids: this.payload.department_ids,
          shift_type_id: this.shift_type_id,
        },
      };

      this.$axios
        .get(`/scheduled_employees_with_type`, options)
        .then(({ data }) => {
          this.scheduled_employees = data;
          this.scheduled_employees.unshift({
            system_user_id: "",
            name_with_user_id: "All Employees",
          });
        });
    },
    setSevenDays(selected_date) {
      const date = new Date(selected_date);

      date.setDate(date.getDate() + 6);

      let datetime = new Date(date);

      let d = datetime.getDate();
      d = d < "10" ? "0" + d : d;
      let m = datetime.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let y = datetime.getFullYear();

      this.max_date = `${y}-${m}-${d}`;
      this.payload.to_date = `${y}-${m}-${d}`;
    },

    setThirtyDays(selected_date) {
      const date = new Date(selected_date);

      date.setDate(date.getDate() + 29);

      let datetime = new Date(date);

      let d = datetime.getDate();
      d = d < "10" ? "0" + d : d;
      let m = datetime.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let y = datetime.getFullYear();

      this.max_date = `${y}-${m}-${d}`;
      this.payload.to_date = `${y}-${m}-${d}`;
    },

    set_date_save(from_menu, field) {
      from_menu.save(field);

      if (this.report_type == "Weekly") {
        this.setSevenDays(this.payload.from_date);
      } else if (
        this.report_type == "Monthly" ||
        this.report_type == "Custom"
      ) {
        this.setThirtyDays(this.payload.from_date);
      }
    },
    setFromDate() {
      if (this.payload.from_date == null) {
        const dt = new Date();
        const y = dt.getFullYear();
        const m = dt.getMonth() + 1;
        const formattedMonth = m < 10 ? "0" + m : m;
        this.payload.from_date = `${y}-${formattedMonth}-01`;
      }
    },

    getDeviceList(options) {
      this.$axios.get(`/device_list`, options).then(({ data }) => {
        this.devices = data;
      });
    },
    getBranches() {
      if (this.$auth.user.branch_id) {
        this.payload.branch_id = this.$auth.user.branch_id;

        this.isCompany = false;
        return;
      }

      this.$axios
        .get("branch", {
          params: {
            per_page: 1000,
            company_id: this.$auth.user.company_id,
          },
        })
        .then(({ data }) => {
          this.branches = data.data;
        });
    },
    setDailyDate() {
      this.payload.daily_date = new Date().toJSON().slice(0, 10);
      delete this.payload.from_date;
      delete this.payload.to_date;
    },
    async getDepartments(options) {
      const { employee, user_type } = this.$auth.user;

      let url = "departments";

      try {
        if (user_type === "employee") {
          const id = employee.id;
          url = "assigned-department-employee";
          const { data } = await this.$axios.get(`${url}/${id}`, options);
          this.departments = data;
        } else {
          const { data } = await this.$axios.get(url, options);
          this.departments = data.data;
          // this.payload.department_ids = [data.data[0].id];
          this.toggleDepartmentSelection();
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    },

    caps(str) {
      return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    },

    setStatusLabel(status) {
      const statuses = {
        A: "Absent",
        P: "Present",
        M: "Missing",
        LC: "Late In",
        EG: "Early Out",
        O: "Week Off",
        L: "Leave",
        H: "Holiday",
        V: "Vaccation",
      };
      return statuses[status];
    },
  },
};
</script>
