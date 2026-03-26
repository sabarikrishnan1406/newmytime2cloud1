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

        <v-dialog persistent v-model="dialogLeaveGroup" width="400px">
          <Close left="375" @click="dialogLeaveGroup = false" />
          <v-card>
            <v-card-title dense class="primary white--text background">
              Statistics
            </v-card-title>
            <v-card-text>
              <v-data-table
                :mobile-breakpoint="$store.state.isDesktop ? 0 : 2000"
                v-model="ids"
                item-key="id"
                :headers="headersGroupInfo"
                :items="DialogLeavesList"
                :hide-default-footer="true"
                class="elevation-1"
              >
                <template v-slot:item.leave_type="{ item }" center>
                  {{ item.leave_type.name }} ({{ item.leave_type.short_name }})
                </template>
                <template v-slot:item.total="{ item }">
                  <v-chip color="black" text-color="white">
                    {{ item.leave_type_count }}</v-chip
                  >
                </template>
                <template v-slot:item.approved="{ item }">
                  <v-chip color="primary"> {{ item.employee_used }}</v-chip>
                </template>
                <template v-slot:item.available="{ item }">
                  <v-chip class="ma-2" color="green" text-color="white">
                    {{ item.leave_type_count - item.employee_used }}</v-chip
                  >
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog
          :key="leaveDialogKey"
          persistent
          v-model="dialog"
          width="800px"
          :light="!$isDark()"
        >
          <Close left="790" @click="close" />
          <SnippetsCard>
            <template #body>
              <v-alert flat dense class="primary white--text">
                <span>{{ formTitle }} </span>
              </v-alert>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="7">
                      <v-row>
                        <v-col cols="8">
                          <v-row dense align="center">
                            <v-col cols="12">
                              <v-menu
                                v-model="fromMenu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    outlined
                                    dense
                                    hide-details
                                    v-model="fromDateFormatted"
                                    label="From Date"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  :class="
                                    $isDark()
                                      ? 'accent white--text dark-mode'
                                      : 'light-background black--text'
                                  "
                                  v-model="editedItem.start_date"
                                  small
                                  no-title
                                  scrollable
                                  @input="fromMenu = false"
                                ></v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="12" class="text-right">
                              <v-menu
                                v-model="toMenu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    outlined
                                    dense
                                    hide-details
                                    v-model="toDateFormatted"
                                    label="To Date"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  :class="
                                    $isDark()
                                      ? 'accent white--text dark-mode'
                                      : 'light-background black--text'
                                  "
                                  small
                                  v-model="editedItem.end_date"
                                  :min="editedItem.start_date"
                                  no-title
                                  scrollable
                                  @input="toMenu = false"
                                ></v-date-picker>
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="4">
                          <v-card
                            :class="
                              $isDark()
                                ? 'accent white--text dark-mode'
                                : 'light-background black--text'
                            "
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
                        <v-col md="12" sm="12" cols="12">
                          <v-select
                            label="Alternate Employee"
                            :items="relatedDepartmentEmployees"
                            item-text="full_name"
                            item-value="employee_id"
                            placeholder="Select Alternate Employee"
                            v-model="alternate_employee"
                            hide-details
                            dense
                            outlined
                            return-object
                          ></v-select>

                          <v-card
                            v-if="alternate_employee"
                            outlined
                            class="mt-4"
                          >
                            <v-alert dense flat class="grey lighten-3"
                              ><small>Alertnate Employee Info</small></v-alert
                            >
                            <v-row align="center" class="px-7 pb-5">
                              <v-col
                                cols="12"
                                md="3"
                                class="text-center text-sm-left"
                              >
                                <v-avatar size="80">
                                  <img
                                    :src="alternate_employee?.profile_picture"
                                    alt="Profile Picture"
                                  />
                                </v-avatar>
                              </v-col>
                              <v-col cols="12" md="9">
                                <div class="d-flex justify-space-between pt-2">
                                  <div style="font-size: 12px">Full Name:</div>
                                  <div style="font-size: 12px">
                                    {{ alternate_employee.full_name }}
                                  </div>
                                </div>
                                <v-divider></v-divider>
                                <div class="d-flex justify-space-between">
                                  <div style="font-size: 12px">
                                    Employee Id:
                                  </div>
                                  <div style="font-size: 12px">
                                    {{ alternate_employee.employee_id }}
                                  </div>
                                </div>
                                <v-divider></v-divider>
                                <div class="d-flex justify-space-between">
                                  <div style="font-size: 12px">Dept:</div>
                                  <div style="font-size: 12px">
                                    {{ alternate_employee.department }}
                                  </div>
                                </div>
                                <v-divider></v-divider>
                                <div class="d-flex justify-space-between">
                                  <div style="font-size: 12px">Desg:</div>
                                  <div style="font-size: 12px">
                                    {{ alternate_employee.designation }}
                                  </div>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-col>
                        <v-col md="12" sm="12" cols="12">
                          <v-select
                            label="Select Leave Type"
                            @change="verifyAvailableCount"
                            :items="leaveTypes"
                            item-text="leave_type.name"
                            item-value="leave_type.id"
                            placeholder="Select Leave Type"
                            v-model="editedItem.leave_type_id"
                            hide-details
                            dense
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col md="12" sm="12" cols="12">
                          <v-text-field
                            label="Available Leaves"
                            hide-details
                            dense
                            outlined
                            v-model="leave_available_count"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col md="12" sm="12" cols="12">
                          <v-textarea
                            rows="3"
                            label="Note"
                            dense
                            outlined
                            v-model="editedItem.reason"
                            placeholder="Reason/Notes"
                            hide-details
                          ></v-textarea>
                        </v-col>
                        <v-col
                          cols="12"
                          v-if="errors && errors.reporting_manager_id"
                        >
                          <label for="" style="padding-bottom: 5px; color: red"
                            >Reporting Manager ID is not assigned. Contact Admin
                          </label>
                        </v-col>
                        <v-col cols="12">
                          <v-btn
                            title="Maximum file upload size is 100Kb"
                            cols="2"
                            @click="dialogUploadDocuments = true"
                            small
                            dense
                            color="primary"
                            outlined
                            block
                            rounded
                            >Upload Document
                          </v-btn>
                        </v-col>
                        <v-col
                          cols="12"
                          v-if="
                            Document.items.length &&
                            (isDocumentTempSaved ||
                              action == 'Edit' ||
                              action == 'View')
                          "
                        >
                          <v-card outlined>
                            <v-simple-table dense class="w-100">
                              <thead>
                                <tr>
                                  <th class="text-left">Title</th>
                                  <th class="text-left">File</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="(d, index) in Document.items"
                                  :key="index"
                                >
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
                      </v-row>
                      <ul class="my-5">
                        <li
                          dense
                          flat
                          v-if="Object.keys(errors)[0]"
                          class="error--text"
                        >
                          {{ errors[Object.keys(errors)[0]][0] }}
                        </li>
                      </ul>
                      <v-row v-if="newLeaveApplication" no-gutters>
                        <v-col cols="6">
                          <div class="d-flex" style="gap: 5px">
                            <v-btn class="primary" block small @click="save"
                              >Save</v-btn
                            >
                            <v-btn
                              class="grey white--text"
                              block
                              small
                              @click="close"
                              >Close</v-btn
                            >
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="5">
                      <LeaveCalendarView />
                      <LeaveOtherEmployees />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </template>
          </SnippetsCard>
        </v-dialog>
        <v-dialog
          persistent
          v-model="dialogUploadDocuments"
          width="800px"
          height="400px"
        >
          <Close left="790" @click="dialogUploadDocuments = false" />

          <v-card>
            <v-alert flat dense class="primary white--text">
              Documents
              <v-spacer></v-spacer>
            </v-alert>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-row v-for="(d, index) in Document.items" :key="index">
                      <v-col>
                        <v-text-field
                          hide-details
                          label="Title"
                          small
                          dense
                          outlined
                          v-model="d.title"
                          placeholder="Title"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-file-input
                          hide-details
                          label="Upload Document"
                          prepend-icon=""
                          @change="handleFileChange($event, index)"
                          small
                          dense
                          outlined
                          v-model="d.file"
                          style="padding: 0px; margin: 0px"
                        >
                          <template v-slot:selection="{ text }">
                            <v-chip
                              v-if="text"
                              small
                              label
                              class="ma-1 text-truncate custom-chip1"
                              style="width: 85px; padding: 0px; margin: 0px"
                              overflow="hidden"
                            >
                              {{ text }}
                            </v-chip>
                          </template>
                        </v-file-input>

                        <span
                          v-if="
                            errorsFileUpload[index] &&
                            errorsFileUpload[index].value
                          "
                          class="text-danger mt-5"
                        >
                          {{ errorsFileUpload[index].value[0] }}
                        </span>
                      </v-col>
                      <v-col cols="1">
                        <v-icon
                          class="error--text mt-1"
                          @click="removeItem(index)"
                          >mdi-close</v-icon
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-icon @click="addDocumentInfo">mdi-plus-circle</v-icon>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn
                      class="grey white--text"
                      small
                      @click="closeDialogUploadDocuments"
                    >
                      Cancel
                    </v-btn>
                    <v-btn class="primary" small @click="SaveDocumentsDialog"
                      >Save---------</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-row>
          <v-col cols="6">
            Leave Group:

            {{
              (DialogLeaveGroupInfo[0] && DialogLeaveGroupInfo[0].group_name) ||
              "---"
            }}
          </v-col>
          <v-col cols="6" class="text-right">
            <v-btn
              :class="
                $isDark()
                  ? 'white--text'
                  : 'black--text'
              "
              :disabled="!$auth.user.employee.leave_group_id"
              small
              color="primary"
              @click="openNewDialog"
              class="mb-2"
              >New +</v-btn
            >
          </v-col>
          <v-col>
            <v-data-table
              :class="
                $isDark()
                  ? 'accent custom-dark-header-for-datatable'
                  : 'light-background custom-light-header-for-datatable'
              "
              :mobile-breakpoint="$store.state.isDesktop ? 0 : 2000"
              v-model="ids"
              item-key="id"
              :headers="headers"
              :items="data"
              :loading="loading"
              :options.sync="options"
              :footer-props="{
                itemsPerPageOptions: [10, 50, 100, 500, 1000],
              }"
            >
              <template v-slot:header="{ props: { headers } }">
                <tr v-if="isFilter">
                  <td v-for="header in headers" :key="header.text">
                    <v-text-field
                      clearable
                      :hide-details="true"
                      v-if="header.filterable && header.text != 'Status'"
                      v-model="filters[header.value]"
                      id="header.value"
                      @input="applyFilters(header.value, $event)"
                      outlined
                      dense
                      autocomplete="off"
                    ></v-text-field>

                    <v-select
                      :hide-details="true"
                      @change="applyFilters('status', $event)"
                      item-value="value"
                      item-text="title"
                      v-model="filters[header.value]"
                      outlined
                      dense
                      v-else-if="header.filterable && header.text == 'Status'"
                      :items="[
                        { value: '', title: 'All' },
                        { value: 'approved', title: 'Approved' },
                        {
                          value: 'rejected',
                          title: 'Rejected',
                        },
                        { value: 'pending', title: 'Pending' },
                      ]"
                    ></v-select>
                  </td>
                </tr>
              </template>
              <template v-slot:item.alternate_employee="{ item }">
                {{
                  item?.alternate_employee?.first_name ||
                  "No Alternate Employee"
                }}
                {{ item?.alternate_employee?.last_name }}
              </template>
              <template v-slot:item.group_name="{ item }">
                {{
                  item.employee.leave_group &&
                  item.employee.leave_group.group_name
                }}
              </template>

              <template v-slot:item.leave_type_name="{ item }">
                {{ item.leave_type.name }}
              </template>
              <template v-slot:item.start_date="{ item }">
                {{ item.start_date }}
              </template>
              <template v-slot:item.end_date="{ item }">
                {{ item.end_date }}
              </template>
              <template v-slot:item.reason="{ item }">
                {{ item.reason.substr(0, 30) + "..." }}
              </template>
              <template v-slot:item.reporting="{ item }">
                {{ item.reporting.first_name }} {{ item.reporting.last_name }}
              </template>
              <template v-slot:item.created_at="{ item }">
                {{ getCurrentDateTime(item.created_at) }}
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  v-if="item.status == 1"
                  small
                  class="p-2 mx-1"
                  color="primary"
                >
                  Approved
                </v-chip>
                <v-chip
                  v-if="item.status == 2"
                  small
                  class="p-2 mx-1"
                  color="error"
                >
                  Rejected
                </v-chip>
                <v-chip
                  v-if="item.status == 0"
                  small
                  class="p-2 mx-1"
                  color="secondary"
                >
                  Pending
                </v-chip>
              </template>

              <template v-slot:item.action="{ item }">
                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn dark-2 icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list width="120" dense>
                    <v-list-item>
                      <v-list-item-title style="cursor: pointer">
                        <LeaveView :editedItem="item" />
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="editItem(item, 'Edit')">
                      <v-list-item-title style="cursor: pointer">
                        <v-icon color="secondary" small> mdi-pencil </v-icon>
                        Edit
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="deleteItem(item)"
                      v-if="item.status == 0"
                    >
                      <v-list-item-title style="cursor: pointer">
                        <v-icon color="error" small @click="deleteItem(item)">
                          {{
                            item.announcement === "customer" ? "" : "mdi-close"
                          }}
                        </v-icon>
                        Delete
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <template v-slot:no-data>
                <!-- <v-btn color="primary" @click="initialize">Reset</v-btn> -->
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
    errorsFileUpload: [],
    Document: {
      items: {
        title: "",
        file: "",
      },
    },
    leave_available_count: 0,
    newLeaveApplication: true,
    filters: {},
    isFilter: false,
    DialogLeavesList: [],
    DialogLeaveGroupInfo: [],
    dialogLeaveGroup: false,
    attrs: {},
    leaveTypes: [],
    formTitle: null,
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
    headersGroupInfo: [
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
    headers: [
      {
        text: "Alertnate Employee Name",
        align: "left",
        sortable: true,
        filterable: true,
        key: "alternate_employee",
        value: "alternate_employee",
      },
      {
        text: "Group Type",
        align: "left",
        filterable: true,
        sortable: true,
        value: "group_name",
      },
      {
        text: "Leave Type",
        align: "left",
        filterable: true,
        sortable: true,
        value: "leave_type_name",
      },
      {
        text: "Star Date",
        align: "left",
        filterable: true,
        sortable: true,
        value: "start_date",
      },
      {
        text: "End Date",
        align: "left",
        filterable: true,
        sortable: true,
        value: "end_date",
      },
      {
        text: "Leave Note",
        align: "left",
        filterable: true,
        sortable: true,
        value: "reason",
      },
      {
        text: "Reporting  ",
        align: "left",
        sortable: true,
        filterable: true,
        value: "reporting",
      },
      {
        text: "Applied On ",
        align: "left",
        sortable: true,
        filterable: true,
        value: "created_at",
      },
      {
        text: "Status",
        align: "left",
        filterable: true,
        sortable: true,
        value: "status",
      },

      { text: "Actions", align: "center", value: "action", sortable: false },
    ],
    editedIndex: -1,
    action: "View",
    editedItem: {
      alternate_employee_id: 0,
      leave_type_id: "",
      reason: "",
      start_date: null,
      end_date: null,
    },
    defaultItem: {
      alternate_employee_id: 0,
      leave_type_id: "",
      reason: "",
      start_date: null,
      end_date: null,
    },
    data: [],
    todayDate: "",
    login_user_employee_id: "",
    relatedDepartmentEmployees: [],

    isDocumentTempSaved: false,
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

  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  async created() {
    this.loading = true;
    this.errors = [];
    this.errorsFileUpload = [];

    this.getDataFromApi();
    if (this.$auth.user.employee.leave_group_id)
      this.getLeaveTypesByGroupId(this.$auth.user.employee.leave_group_id);

    let now = new Date();

    let year = now.getFullYear();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);

    let formattedDateTime = year + "-" + month + "-" + day;

    this.todayDate = formattedDateTime;

    this.gotoGroupDetails();

    this.getEmployeeByDepartmentId();
  },

  methods: {
    async getEmployeeByDepartmentId() {
      let options = {
        params: {
          company_id: this.$auth.user.company_id,
          department_id: this.$auth.user.employee.department_id,
        },
      };
      let { data } = await this.$axios.get(`employee-list`, options);

      this.relatedDepartmentEmployees = data.map((e) => ({
        id: e.id,
        profile_picture: e.profile_picture,
        employee_id: e.employee_id,
        full_name: e.full_name,
        department: e?.department?.name,
        designation: e?.designation?.name,
      }));
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
    closeDialogUploadDocuments() {
      this.Document = {
        items: [],
      };
      this.errors = [];
      this.errorsFileUpload = [];
      this.dialogUploadDocuments = false;
    },
    SaveDocumentsDialog() {
      this.dialogUploadDocuments = false;
      this.isDocumentTempSaved = true;
    },
    verifyAvailableCount(leaveTypeId) {
      let filterObject = this.DialogLeavesList.find(
        (item) => item.leave_type_id === leaveTypeId
      );

      if (filterObject.leave_type_count - filterObject.employee_used >= 0) {
        this.newLeaveApplication = true;
      } else {
        this.newLeaveApplication = false;
      }
      this.leave_available_count =
        filterObject.employee_used + "/" + filterObject.leave_type_count;
    },
    applyFilters(filter_column = "", filter_value = "") {
      this.getDataFromApi("", filter_column, filter_value);
    },
    getCurrentDateTime(date) {
      let now = new Date(date);

      let year = now.getFullYear();
      let day = ("0" + now.getDate()).slice(-2);
      let month = ("0" + (now.getMonth() + 1)).slice(-2);

      let formattedDateTime = year + "-" + month + "-" + day; // + " " + hours + ":" + minutes;

      return formattedDateTime;
    },
    gotoGroupDetails(leaveGroupId = "") {
      if (leaveGroupId == "") {
        leaveGroupId = this.$auth.user.employee.leave_group_id;
      }
      if (leaveGroupId) {
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
            //  this.dialogLeaveGroup = true;
            this.DialogLeaveGroupInfo = data;
            this.DialogLeavesList = data[0].leave_count;
          });
      }
    },
    openNewDialog() {
      this.formTitle = "New Leave";
      this.editedIndex = -1;
      this.editedItem = {
        leave_type_id: "",
        reason: "",
        start_date: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
        end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
      };
      this.errors = [];
      this.errorsFileUpload = [];

      this.dialog = true;

      this.Document = {
        items: [],
      };
      this.leave_available_count = 0;
    },
    getLeaveTypesByGroupId(leaveGroupId) {
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
    },

    getDataFromApi(url = this.endpoint, filter_column = "", filter_value = "") {
      if (url == "") url = this.endpoint;
      this.loading = true;

      let endDate = new Date();

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
          year: endDate.getFullYear(),
          employee_id: this.$auth.user.employee.id,
        },
      };
      if (filter_column != "") {
        this.payloadOptions.params[filter_column] = filter_value;
      }

      this.$axios
        .get(`${url}?page=${page}`, this.payloadOptions)
        .then(({ data }) => {
          if (filter_column != "" && data.data.length == 0) {
            this.loading = false;
            //return false;
          }
          this.data = data.data;
          this.totalRowsCount = data.total;

          this.currentPage = page;
          this.perPage = itemsPerPage;

          this.total = data.total;
          this.loading = false;
          this.gotoGroupDetails("");

          if (this.$auth)
            if (this.$auth.user)
              this.login_user_employee_id = this.$auth.user.employee.id;
        });
    },

    editItem(item, action = "Edit") {
      this.action = action;
      this.formTitle = "Edit Leave";
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);

      this.alternate_employee = {
        ...item.alternate_employee,
        department: item?.alternate_employee?.department?.name,
        designation: item?.alternate_employee?.designation?.name,
      };

      this.dialog = true;
      this.errorsFileUpload = [];
      this.getInfo(this.editedItem.id);
      this.verifyAvailableCount(this.editedItem.leave_type_id);
    },

    deleteItem(item) {
      confirm(
        "Are you sure you wish to delete , to mitigate any inconvenience in future."
      ) &&
        this.$axios
          .delete(this.endpoint + "/" + item.id)
          .then(({ data }) => {
            if (!data.status) {
              this.errors = data.errors;
            } else {
              this.getDataFromApi();
              this.snackbar = data.status;
              this.response = data.message;
            }
          })
          .catch((err) => console.log(err));
    },

    close() {
      this.leaveDialogKey += 1;
      this.dialog = false;
      this.editedItem = {
        alternate_employee_id: 0,
        leave_type_id: "",
        reason: "",
        start_date: null,
        end_date: null,
      };
      this.alternate_employee = null;
      this.isDocumentTempSaved = false;
    },
    async save() {
      let options = {
        params: {
          company_id: this.$auth.user.company_id,
          employee_id: this.login_user_employee_id,
          reporting_manager_id: this.$auth.user.employee.reporting_manager_id,
          leave_type_id: this.editedItem.leave_type_id,
          start_date: this.editedItem.start_date,
          end_date: this.editedItem.end_date,
          reason: this.editedItem.reason,
          alternate_employee_id: this.alternate_employee.id || 0,
        },
      };

      if (this.editedIndex > -1) {
        await this.$axios
          .put(this.endpoint + "/" + this.editedItem.id, options.params)
          .then(({ data }) => {
            if (!data.status) {
              this.errors = data.errors;
            } else {
              this.save_document_info(this.editedItem.id);

              this.getDataFromApi();
              this.snackbar = data.status;
              this.response = data.message;
              this.close();
              this.errors = [];
            }
          })
          .catch((err) => console.log(err));
      } else {
        this.$axios
          .post(this.endpoint, options.params)
          .then(({ data }) => {
            if (!data.status) {
              this.errors = data.errors;
            } else {
              this.save_document_info(data.record.id);

              this.getDataFromApi();
              this.snackbar = data.status;
              this.response = data.message;
              this.close();
              this.errors = [];
            }
          })
          .catch((res) => console.log(res));
      }
    },

    addDocumentInfo() {
      this.Document.items.push({
        title: "",
        file: "",
      });
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

    handleFileChange(event, index) {
      const file = event; // Since event is already the File object
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        this.$set(this.Document.items[index], "previewUrl", previewUrl);
      }
    },
    uploadFilesizeValidation(file, index) {
      if (file) {
        if (file && file.size > 1024 * 100) {
          this.errorsFileUpload[index] = {
            status: false,

            value: ["<100Kb.   "],
          };
          return false;
        } else {
          this.errorsFileUpload[index] = {};
          return true;
        }
      }
    },
    save_document_info(leave_id) {
      let options = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      let payload = new FormData();
      let totalFiles = 0;
      this.Document.items.forEach((e) => {
        if (e.file != "" && this.uploadFilesizeValidation(e.file, totalFiles)) {
          totalFiles++;
          payload.append(`items[][key]`, e.title);
          payload.append(`items[][value]`, e.file || {});
        }
      });
      if (totalFiles) {
        payload.append(`company_id`, this.$auth?.user?.company?.id);
        payload.append(`leave_id`, leave_id);
        payload.append(`employee_id`, this.login_user_employee_id);

        this.$axios
          .post(`employee_document`, payload, options)
          .then(({ data }) => {
            this.loading = false;

            if (!data.status) {
            } else {
              this.snackbar = true;
              this.response = data.message;
              this.getInfo(leave_id);
            }
          })
          .catch((e) => console.log(e));
      }
    },

    close_document_info() {
      this.documents = false;
      this.errors = [];
    },

    removeItem(index) {
      this.errorsFileUpload[index] = {
        status: true,
        value: [],
      };
      this.Document.items.splice(index, 1);
    },

    delete_document(id, leave_id) {
      confirm(
        "Are you sure you wish to delete , to mitigate any inconvenience in future."
      ) &&
        this.$axios
          .delete(`employee_document/${id}`)
          .then(({ data }) => {
            this.loading = false;

            if (!data.status) {
              this.errors = data.errors;
            } else {
              this.errors = [];
              this.snackbar = true;
              this.response = data.message;
              this.getInfo(leave_id);
              this.close_document_info();
            }
          })
          .catch((e) => console.log(e));
    },
  },
};
</script>
