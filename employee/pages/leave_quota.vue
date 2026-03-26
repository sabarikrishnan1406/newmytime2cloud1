<template>
  <SnippetsCard class="px-5">
    <template #body>
      <div>
        <div class="text-center ma-2">
          <v-snackbar
            v-model="snackbar"
            top="top"
            color="secondary"
            elevation="24"
          >
            {{ response }}
          </v-snackbar>
        </div>
        <v-row>
          <v-col cols="12"> Leave Group : {{ leave_group_name }} </v-col>
          <v-col cols="12">
            <v-data-table
              :class="
                $isDark()
                  ? 'accent custom-dark-header-for-datatable'
                  : 'light-background custom-light-header-for-datatable'
              "
              item-key="id"
              :headers="headersGroupInfo"
              :items="DialogLeaveGroupData"
              :loading="loading"
              :hide-default-footer="true"
            >
              <template v-slot:item.sno="{ item, index }">
                {{
                  currentPage
                    ? (currentPage - 1) * perPage +
                      (cumulativeIndex + DialogLeaveGroupData.indexOf(item))
                    : "-"
                }}
              </template>

              <template v-slot:item.leave_type="{ item }" center>
                {{ item.leave_type.name }} ({{ item.leave_type.short_name }})
              </template>
              <template v-slot:item.total="{ item }">
                <div
                  color="green"
                  text-color="white"
                  class="leave-quota"
                  style="color: green"
                >
                  {{ item.leave_type_count }}
                </div>
              </template>
              <template v-slot:item.approved="{ item }">
                <span
                  color="primary"
                  class="leave-quota"
                  style="color: primary"
                >
                  {{ item.employee_used }}
                </span>
              </template>
              <template v-slot:item.available="{ item }">
                <span
                  color="green"
                  text-color="white"
                  class="leave-quota"
                  style="color: orangered"
                >
                  {{ item.leave_type_count - item.employee_used }}
                </span>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </div>
    </template>
  </SnippetsCard>
</template>
<script>
export default {
  // props: ["table_id", "employee_id", "system_user_id"],
  data: () => ({
    DialogLeaveGroupData: [],
    leave_group_name: "",
    cumulativeIndex: 1,
    perPage: 10,
    currentPage: 1,
    branchesList: [],
    branch_id: null,

    totalRowsCount: 0,

    snack: false,
    snackColor: "",
    snackText: "",
    displayNoRecords: false,

    Module: "Employee Schedule",
    shift_types: [],
    manual_shift: {},
    options: { perPage: 10 },
    options_dialog: {},
    endpoint: "scheduled_employees_index",
    endpoint_dialog: "scheduled_employees_list",
    search: "",
    shifts_for_filter: [],
    dialog_search: "",
    snackbar: false,
    dialog: false,
    editDialog: false,

    loading: false,
    loading_dialog: false,
    isEdit: false,
    total: 0,
    total_dialog: 0,
    system_user_id: 0,

    headersGroupInfo: [
      {
        text: "#",
        align: "left",
        key: "name",
        sortable: false,
        value: "sno",
      },
      {
        text: "Leave Type",
        align: "left",
        key: "name",
        sortable: false,
        value: "leave_type",
      },
      {
        text: "Total",
        align: "center",
        key: "name",
        sortable: false,
        value: "total",
      },
      {
        text: "Approved",
        align: "center",
        key: "name",
        sortable: false,
        value: "approved",
      },
      {
        text: "Available",
        align: "center",
        key: "name",
        sortable: false,
        value: "available",
      },
    ],
    pagination: {
      current: 1,
      total: 0,
      per_page: 10,
    },
    response: "",
    data: [],

    errors: [],
    headers_ids: [],
  }),

  computed: {},

  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  created() {
    this.system_user_id = this.$auth.user.employee.system_user_id;
    this.getDataFromApi();
  },

  methods: {
    getDataFromApi() {
      let leaveGroupId = this.$auth.user.employee.leave_group_id;
      let employee_id = this.$auth.user.employee.employee_id;
      let employee_name = this.$auth.user.employee.first_name;
      if (!leaveGroupId) {
        return false;
      }
      this.dialogLeaveGroup = true;
      this.viewEmployeeName = employee_name;
      let options = {
        params: {
          per_page: 1000,
          company_id: this.$auth.user.company_id,
          employee_id: employee_id,
        },
      };
      this.$axios
        .get("leave_groups/" + leaveGroupId, options)
        .then(({ data }) => {
          this.DialogLeaveGroupData = data[0].leave_count;
          this.leave_group_name = data[0].group_name;
        });
    },
  },
};
</script>
