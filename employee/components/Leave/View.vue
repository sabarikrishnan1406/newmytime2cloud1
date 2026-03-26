<template>
  <span>
    <style scoped>
      .v-date-picker-table .v-btn--active {
        background: white !important;
        color: black !important;
      }

      .v-date-picker-table .v-btn--active::before {
        opacity: 0 !important;
      }

      .v-date-picker-table {
        height: 192px !important;
      }

      .v-date-picker-table--date .v-btn {
        height: 25px !important;
        width: 25px !important;
        font-size: 10px !important;
      }
      .v-date-picker-table--date th {
        padding: 0 !important;
      }
    </style>
    <v-dialog :key="leaveDialogKey" persistent v-model="dialog" width="800px">
      <Close left="790" @click="close" />
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">
          <v-icon color="secondary" small>mdi-eye</v-icon> View
        </span>
      </template>

      <v-card v-if="editedItem && editedItem.id">
        <v-alert flat dense class="primary white--text">
          <span> Leave Information </span>
        </v-alert>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="7">
                <v-row>
                  <v-col cols="8">
                    <v-row dense align="center">
                      <v-col cols="12">
                        <v-text-field
                          outlined
                          dense
                          hide-details
                          v-model="fromDateFormatted"
                          label="From Date"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="text-right">
                        <v-text-field
                          outlined
                          dense
                          hide-details
                          v-model="toDateFormatted"
                          label="To Date"
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="4">
                    <v-card
                      outlined
                      style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 88px;
                      "
                    >
                      <b>{{ dayDifference }} Days</b>
                    </v-card>
                  </v-col>
                  <v-col v-if="editedItem.alternate_employee" md="12" sm="12" cols="12">
                    <v-card outlined>
                      <v-alert dense flat class="grey lighten-3"
                        ><small>Alertnate Employee Info</small></v-alert
                      >
                      <v-row align="center" class="px-7">
                        <v-col cols="3">
                          <v-avatar size="80">
                            <!-- src="https://cdn.vuetifyjs.com/images/lists/1.jpg" -->
                            <img
                              :src="editedItem?.alternate_employee?.profile_picture"
                              alt="Profile Picture"
                            />
                          </v-avatar>
                        </v-col>

                        <v-col>
                          <div class="d-flex justify-space-between pt-2">
                            <div style="font-size: 12px">Full Name:</div>
                            <div style="font-size: 12px">
                              {{ editedItem?.alternate_employee?.full_name }}
                            </div>
                          </div>
                          <v-divider></v-divider>
                          <div class="d-flex justify-space-between">
                            <div style="font-size: 12px">Employee Id:</div>
                            <div style="font-size: 12px">
                              {{ editedItem?.alternate_employee?.employee_id }}
                            </div>
                          </div>
                          <v-divider></v-divider>
                          <div class="d-flex justify-space-between">
                            <div style="font-size: 12px">Dept:</div>
                            <div style="font-size: 12px">
                              {{ editedItem?.alternate_employee?.department?.name }}
                            </div>
                          </div>
                          <v-divider></v-divider>
                          <div class="d-flex justify-space-between">
                            <div style="font-size: 12px">Desg:</div>
                            <div style="font-size: 12px">
                              {{ editedItem?.alternate_employee?.designation?.name }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <v-col md="12" sm="12" cols="12">
                    <v-select
                      append-icon=""
                      label="Leave Type"
                      :items="leaveTypes"
                      item-text="leave_type.name"
                      item-value="leave_type.id"
                      placeholder="Select Leave Type"
                      v-model="editedItem.leave_type_id"
                      hide-details
                      dense
                      outlined
                      readonly
                    ></v-select>
                  </v-col>

                  <v-col cols="12" v-if="errors && errors.reporting_manager_id">
                    <label for="" style="padding-bottom: 5px; color: red"
                      >Reporting Manager ID is not assigned. Contact Admin
                    </label>
                  </v-col>

                  <v-col cols="12" v-if="Document.items.length" >
                    <v-card outlined>
                        <v-simple-table dense class="w-100">
                      <thead>
                        <tr>
                          <th class="text-left">Title</th>
                          <th class="text-left">File</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(d, index) in Document.items" :key="index">
                          <td class="text-left">
                            {{ d.title }}
                          </td>
                          <td class="text-left">
                            <a :href="d.previewUrl" target="_blank">
                              View file
                              <v-icon small>mdi-open-in-new</v-icon>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                    </v-card>
                  </v-col>

                  <v-col cols="12" v-if="leaveStatus.length">
                    <v-card outlined>
                      <v-simple-table dense class="w-100">
                        <thead>
                          <tr>
                            <th class="text-center" style="font-size: 12px">
                              Leave Group
                            </th>
                            <th class="text-center" style="font-size: 12px">
                              Total
                            </th>
                            <th class="text-center" style="font-size: 12px">
                              Used
                            </th>
                            <th class="text-center" style="font-size: 12px">
                              Available
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(d, index) in leaveStatus" :key="index">
                            <td class="text-center" style="font-size: 12px">
                              {{ d.leave_group }}
                            </td>
                            <td class="text-center" style="font-size: 12px">
                              {{ d.total }}
                            </td>
                            <td class="text-center" style="font-size: 12px">
                              {{ d.used }}
                            </td>
                            <td class="text-center" style="font-size: 12px">
                              {{ d.available }}
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-card>
                  </v-col>

                  <v-col md="12" sm="12" cols="12">
                    <v-textarea
                      rows="2"
                      label="Note"
                      dense
                      outlined
                      v-model="editedItem.reason"
                      placeholder="Reason/Notes"
                      hide-details
                      readonly
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="5">
                <LeaveCalendarView />
                <LeaveOtherEmployees />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </span>
</template>
<script>
export default {
  props: ["editedItem"],
  data: () => ({
    leaveDialogKey: 1,
    fromMenu: false,
    toMenu: false,
    perPage: 10,
    currentPage: 1,
    totalRowsCount: 0,
    options: {
      current: 1,
      total: 0,
      itemsPerPage: 10,
    },

    dialogUploadDocuments: false,
    valid: true,
    documents: false,
    response: "",
    errors: [],
    Document: {
      items: {
        title: "",
        file: "",
      },
    },
    leaveStatus: [],
    newLeaveApplication: true,
    filters: {},
    isFilter: false,
    DialogLeavesList: [],
    DialogLeaveGroupInfo: [],
    dialogLeaveGroup: false,
    attrs: {},
    leaveTypes: [],
    snack: false,
    snackText: "",
    title: "",
    des: "",
    desDate: "",
    dept: "",
    options: {
      current: 1,
      total: 0,
      itemsPerPage: 10,
    },

    Model: "leaves",
    endpoint: "employee_leaves",
    snackbar: false,
    dialog: false,
    ids: [],
    loading: false,
    total: 0,
    data: [],
    todayDate: "",
    login_user_employee_id: "",
    alternate_employee: null,
  }),

  computed: {
    fromDateFormatted() {
      if (!this.editedItem.start_date) return null;
      return this.formatDate(this.editedItem.start_date);
    },
    toDateFormatted() {
      if (!this.editedItem.end_date) return null;
      return this.formatDate(this.editedItem.end_date);
    },
    dayDifference() {
      const from = new Date(this.editedItem.start_date);
      const to = new Date(this.editedItem.end_date);
      return Math.max(1, (to - from) / (1000 * 60 * 60 * 24) + 1);
    },
  },
  async created() {
    this.loading = true;
    this.errors = [];

    let now = new Date();

    let year = now.getFullYear();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);

    let formattedDateTime = year + "-" + month + "-" + day;

    this.todayDate = formattedDateTime;

    let item = this.editedItem;

    this.alternate_employee = {
      ...item.alternate_employee,
      department: item?.alternate_employee?.department?.name,
      designation: item?.alternate_employee?.designation?.name,
    };

    this.getInfo(item.id);
    this.verifyAvailableCount(item.leave_type_id);
  },

  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
    verifyAvailableCount(leaveTypeId) {
      let leaveGroupId = this.$auth.user.employee.leave_group_id;

      if (leaveGroupId) {
        let options = {
          params: {
            per_page: 1000,
            company_id: this.$auth.user.company_id,
          },
        };
        this.$axios
          .get("leave_groups/" + leaveGroupId, options)
          .then(({ data }) => {
            this.leaveTypes = data[0].leave_count;
          });
      }

      let options = {
        params: {
          per_page: 1000,
          company_id: this.$auth.user.company_id,
          employee_id: this.$auth.user.employee.id,
        },
      };
      this.$axios
        .get("leave_groups/" + leaveGroupId, options)
        .then(({ data }) => {
          this.leaveStatus = data[0].leave_count.map((e) => ({
            leave_group: e.leave_type.short_name,
            used: e.employee_used,
            total: e.leave_type_count,
            available: e.leave_type_count - e.employee_used,
          }));
        });
    },

    close() {
      this.leaveDialogKey += 1;
      this.dialog = false;
      this.alternate_employee = null;
    },
    getInfo(leave_id) {
      this.$axios
        .get(`employee_document`, {
          params: {
            company_id: this.$auth?.user?.company?.id,
            employee_id: this.login_user_employee_id,
            leave_id: leave_id,
          },
        })
        .then(({ data }) => {
          // this.Document.items = data;

          this.Document.items = data.map((e) => ({
            title: e.key,
            previewUrl: e.value,
          }));
          this.loading = false;
        });
    },

    close_document_info() {
      this.documents = false;
      this.errors = [];
    },
  },
};
</script>
