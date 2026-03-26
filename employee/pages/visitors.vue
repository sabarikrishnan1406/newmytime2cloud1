<template>
  <div v-if="can('employee_access')">
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" small top="top" :color="color">
        {{ response }}
      </v-snackbar>
    </div>
    <div v-if="!loading">
      <v-dialog persistent v-model="dialogCropping" width="500">
        <v-card style="padding-top: 20px">
          <v-card-text>
            <VueCropper
              v-show="selectedFile"
              ref="cropper"
              :src="selectedFile"
              alt="Source Image"
              :aspectRatio="1"
              :autoCropArea="0.9"
              :viewMode="3"
            ></VueCropper>
          </v-card-text>

          <v-card-actions>
            <div col="6" md="6" class="col-sm-12 col-md-6 col-12 pull-left">
              <v-btn
                class="danger btn btn-danger text-left"
                text
                @click="closePopup()"
                style="float: left"
                >Cancel</v-btn
              >
            </div>
            <div col="6" md="6" class="col-sm-12 col-md-6 col-12 text-right">
              <v-btn
                class="primary btn btn-danger text-right"
                @click="saveCroppedImageStep2(), (dialog = false)"
                >Crop</v-btn
              >
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog persistent v-model="DialogBox" width="1100">
        <v-card>
          <v-toolbar class="popup_background" flat>
            {{ formAction }} Visitor
          </v-toolbar>
          <v-container>
            <v-row>
              <v-col cols="3" class="pt-5">
                <div class="form-group" style="margin: 0 auto; width: 200px">
                  <v-img
                    style="
                      width: 100%;
                      height: 200px;
                      border: 1px solid #5fafa3;
                      border-radius: 50%;
                      margin: 0 auto;
                    "
                    :src="previewImage || '/no-profile-image.jpg'"
                  ></v-img>
                  <br />
                  <v-btn
                    :disabled="disabled"
                    small
                    class="form-control primary"
                    @click="onpick_attachment"
                    >{{ !upload.name ? "Upload" : "Change" }} Profile Image
                    <v-icon right dark>mdi-cloud-upload</v-icon>
                  </v-btn>
                  <input
                    required
                    type="file"
                    @change="attachment"
                    style="display: none"
                    accept="image/*"
                    ref="attachment_input"
                  />

                  <span
                    v-if="errors && errors.profile_picture"
                    class="text-danger mt-2"
                    >{{ errors.profile_picture[0] }}</span
                  >
                </div>
              </v-col>
              <v-col cols="9" class="pt-5">
                <v-row>
                  <v-col cols="4">
                    <v-select
                      label="Timezone"
                      :disabled="disabled"
                      v-model="payload.timezone_id"
                      placeholder="Timezone"
                      :items="timezones"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center pt-3"
                      outlined
                      item-text="timezone_name"
                      item-value="timezone_id"
                      :hide-details="!errors.timezone_id"
                      :error="errors.timezone_id"
                      :error-messages="
                        errors && errors.timezone_id
                          ? errors.timezone_id[0]
                          : ''
                      "
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      label="Zone"
                      :disabled="disabled"
                      v-model="payload.zone_id"
                      placeholder="Zone"
                      :items="zones"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center pt-3"
                      outlined
                      item-text="name"
                      item-value="id"
                      :hide-details="!errors.zone_id"
                      :error="errors.zone_id"
                      :error-messages="
                        errors && errors.zone_id ? errors.zone_id[0] : ''
                      "
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      label="Visitor Device Id"
                      :disabled="disabled"
                      autofocus
                      placeholder="Device Id"
                      v-model="payload.system_user_id"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center pt-3"
                      outlined
                      :hide-details="!errors.system_user_id"
                      :error="errors.system_user_id"
                      :error-messages="
                        errors && errors.system_user_id
                          ? errors.system_user_id[0]
                          : ''
                      "
                    ></v-text-field>
                  </v-col>

                  <v-col cols="4">
                    <v-menu
                      ref="visit_from_menu_ref"
                      v-model="visit_from_menu"
                      :close-on-content-click="false"
                      :return-value.sync="payload.visit_from"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          label="Visit From"
                          :disabled="disabled"
                          :hide-details="!errors.visit_from"
                          :error="errors.visit_from"
                          :error-messages="
                            errors && errors.visit_from
                              ? errors.visit_from[0]
                              : ''
                          "
                          v-model="payload.visit_from"
                          append-icon="mdi-calendar"
                          outlined
                          dense
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="payload.visit_from"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="visit_from_menu = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.visit_from_menu_ref.save(payload.visit_from)
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="4">
                    <v-menu
                      ref="visit_to_menu_ref"
                      v-model="visit_to_menu"
                      :close-on-content-click="false"
                      :return-value.sync="payload.visit_to"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          label="Visit To"
                          :disabled="disabled"
                          :hide-details="!errors.visit_to"
                          :error="errors.visit_to"
                          :error-messages="
                            errors && errors.visit_to ? errors.visit_to[0] : ''
                          "
                          v-model="payload.visit_to"
                          append-icon="mdi-calendar"
                          outlined
                          dense
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="payload.visit_to"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="visit_to_menu = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.visit_to_menu_ref.save(payload.visit_to)
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      label="Purpose"
                      :disabled="disabled"
                      v-model="payload.purpose_id"
                      :items="purposes"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center"
                      outlined
                      item-text="name"
                      item-value="id"
                      :hide-details="!errors.purpose_id"
                      :error="errors.purpose_id"
                      :error-messages="
                        errors && errors.purpose_id ? errors.purpose_id[0] : ''
                      "
                    ></v-select>
                  </v-col>

                  <v-col cols="4">
                    <v-text-field
                      label="First Name"
                      :disabled="disabled"
                      v-model="payload.first_name"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center"
                      outlined
                      :hide-details="!errors.first_name"
                      :error="errors.first_name"
                      :error-messages="
                        errors && errors.first_name ? errors.first_name[0] : ''
                      "
                    ></v-text-field>
                  </v-col>

                  <v-col cols="4">
                    <v-text-field
                      label="Last Name"
                      :disabled="disabled"
                      v-model="payload.last_name"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center"
                      outlined
                      :hide-details="!errors.last_name"
                      :error="errors.last_name"
                      :error-messages="
                        errors && errors.last_name ? errors.last_name[0] : ''
                      "
                    ></v-text-field>
                  </v-col>

                  <v-col cols="4">
                    <v-select
                      label="Gender"
                      :disabled="disabled"
                      :items="[`Male`, `Female`]"
                      v-model="payload.gender"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center"
                      outlined
                      :hide-details="!errors.gender"
                      :error="errors.gender"
                      :error-messages="
                        errors && errors.gender ? errors.gender[0] : ''
                      "
                    ></v-select>
                  </v-col>

                  <v-col cols="4">
                    <v-text-field
                      label="Phone Number"
                      :disabled="disabled"
                      v-model="payload.phone_number"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center"
                      outlined
                      :hide-details="!errors.phone_number"
                      :error="errors.phone_number"
                      :error-messages="
                        errors && errors.phone_number
                          ? errors.phone_number[0]
                          : ''
                      "
                    ></v-text-field>
                  </v-col>

                  <v-col cols="4">
                    <v-text-field
                      label="Email Address (optional)"
                      :disabled="disabled"
                      v-model="payload.email"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center"
                      outlined
                      :hide-details="!errors.email"
                      :error="errors.email"
                      :error-messages="
                        errors && errors.email ? errors.email[0] : ''
                      "
                    ></v-text-field>
                  </v-col>

                  <v-col cols="4">
                    <v-text-field
                      label="Company Name"
                      :disabled="disabled"
                      v-model="payload.visitor_company_name"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center"
                      outlined
                      :hide-details="!errors.visitor_company_name"
                      :error="errors.visitor_company_name"
                      :error-messages="
                        errors && errors.visitor_company_name
                          ? errors.visitor_company_name[0]
                          : ''
                      "
                    ></v-text-field>
                  </v-col>

                  <v-col cols="4">
                    <v-select
                      label="ID Type"
                      :disabled="disabled"
                      v-model="payload.id_type"
                      :items="[
                        { id: 1, name: `Emirates ID` },
                        { id: 2, name: `National ID` },
                      ]"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center"
                      outlined
                      item-text="name"
                      item-value="id"
                      :hide-details="!errors.id_type"
                      :error="errors.id_type"
                      :error-messages="
                        errors && errors.id_type ? errors.id_type[0] : ''
                      "
                    ></v-select>
                  </v-col>

                  <v-col cols="4">
                    <v-text-field
                      label="ID Number"
                      :disabled="disabled"
                      v-model="payload.id_number"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center"
                      outlined
                      :hide-details="!errors.id_number"
                      :error="errors.id_number"
                      :error-messages="
                        errors && errors.id_number ? errors.id_number[0] : ''
                      "
                    ></v-text-field>
                  </v-col>

                  <!-- <v-col cols="4">
                        <label class="col-form-label"
                          >ID Copy<span class="text-danger">*</span></label
                        >
                        <v-text-field
                          :disabled="disabled"
                          v-model="payload.id_copy"
                          dense
                          menu-props="min-width: auto; max-height: 200px;"
                          class="text-center"
                          outlined
                          :hide-details="!errors.id_copy"
                          :error="errors.id_copy"
                          :error-messages="
                            errors && errors.id_copy ? errors.id_copy[0] : ''
                          "
                        ></v-text-field>
                      </v-col> -->

                  <v-col cols="4">
                    <v-select
                      label="Host"
                      :disabled="disabled"
                      v-model="payload.host_company_id"
                      :items="host_list"
                      dense
                      menu-props="min-width: auto; max-height: 200px;"
                      class="text-center"
                      outlined
                      item-text="name"
                      item-value="id"
                      :hide-details="!errors.host_company_id"
                      :error-messages="
                        errors && errors.host_company_id
                          ? errors.host_company_id[0]
                          : ''
                      "
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      rows="2"
                      label="Reason"
                      :disabled="disabled"
                      v-model="payload.reason"
                      dense
                      class="text-center"
                      outlined
                      :hide-details="!errors.reason"
                      :error="errors.reason"
                      :error-messages="
                        errors && errors.reason ? errors.reason[0] : ''
                      "
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>

          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <div class="text-right">
              <v-btn small color="grey white--text" @click="DialogBox = false">
                Close
              </v-btn>

              <v-btn
                v-if="can('employee_create') && formAction == 'Create'"
                small
                :loading="loading"
                color="primary"
                @click="store_data"
              >
                Submit
              </v-btn>
              <v-btn
                v-else-if="can('employee_create') && formAction == 'Edit'"
                small
                :loading="loading"
                color="primary"
                @click="update_data"
              >
                Update
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="text-center">
        <v-dialog
          persistent
          v-model="viewDialog"
          width="1200"
          :key="employeeId"
        >
          <EmployeeDetails
            @close-parent-dialog="closeViewDialog"
            :employeeObject="employeeObject"
          />
        </v-dialog>
      </div>

      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}

        <template v-slot:action="{ attrs }">
          <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
        </template>
      </v-snackbar>

      <div v-if="can(`employee_view`)">
        <v-container>
          <v-card elevation="0">
            <v-toolbar class="mb-2" dense flat>
              <v-toolbar-title
                ><span>{{ Model }}s </span></v-toolbar-title
              >
              <!-- <v-tooltip top color="primary">
                <template v-slot:activator="{ on, attrs }"> -->
              <v-btn
                dense
                class="ma-0 px-0"
                x-small
                :ripple="false"
                text
                title="Reload"
              >
                <v-icon class="ml-2" @click="clearFilters" dark
                  >mdi mdi-reload</v-icon
                >
              </v-btn>
              <!-- </template>
                <span>Reload</span>
              </v-tooltip> -->
              <!-- <v-tooltip top color="primary">
                <template v-slot:activator="{ on, attrs }"> -->
              <!-- <v-btn
                dense
                class="ma-0 px-0"
                x-small
                :ripple="false"
                text
                title="Filter"
              >
                <v-icon @click="toggleFilter" class="mx-1 ml-2"
                  >mdi mdi-filter</v-icon
                >
              </v-btn> -->
              <!-- </template>
                <span>Filter</span>
              </v-tooltip> -->

              <v-spacer></v-spacer>
              <!-- <v-tooltip top color="primary">
                <template v-slot:activator="{ on, attrs }"> -->
              <!-- <v-btn
                dense
                x-small
                class="ma-0 px-0"
                :ripple="false"
                text
                title="Add Visitor"
                @click="DialogBox = true"
              >
                <v-icon right size="x-large" dark v-if="can('employee_create')"
                  >mdi-plus-circle</v-icon
                >
              </v-btn> -->
              <!-- </template>
                <span>Add Visitor</span>
              </v-tooltip> -->
            </v-toolbar>
            <v-data-table
              :mobile-breakpoint="$store.state.isDesktop ? 0 : 2000"
              dense
              :headers="headers"
              :items="data"
              model-value="data.id"
              :loading="loadinglinear"
              :options.sync="options"
              :footer-props="{
                itemsPerPageOptions: [100, 500, 1000],
              }"
              class="elevation-1"
              :server-items-length="totalRowsCount"
            >
              <template v-slot:header="{ props: { headers } }">
                <tr v-if="isFilter">
                  <td v-for="header in headers" :key="header.text">
                    <v-container>
                      <v-text-field
                        clearable
                        @click:clear="
                          filters[header.value] = '';
                          applyFilters();
                        "
                        :hide-details="true"
                        v-if="header.filterable && !header.filterSpecial"
                        v-model="filters[header.value]"
                        :id="header.value"
                        @input="applyFilters(header.key, $event)"
                        outlined
                        dense
                        autocomplete="off"
                      ></v-text-field>
                    </v-container>
                  </td>
                </tr>
              </template>
              <template v-slot:item.first_name="{ item, index }">
                <v-img
                  style="
                    border-radius: 50%;
                    width: 60px;
                    max-width: 60px;
                    height: 60px;
                  "
                  :src="item.logo ? item.logo : '/no-profile-image.jpg'"
                >
                </v-img>

                <div class="text-center">
                  {{ item.first_name }}
                  {{ item.last_name }}
                </div>
              </template>

              <template v-slot:item.host="{ item }">
                {{ item.host.employee.first_name }}
              </template>

              <template v-slot:item.timezone="{ item }">
                {{ item.timezone.timezone_name }}
              </template>

              <template v-slot:item.id_type="{ item }">
                <span v-if="item.id_type == 1">Emirates ID</span>
                <span v-else-if="item.id_type == 2">National ID</span>
              </template>

              <template v-slot:item.purpose="{ item }">
                {{ item.purpose.name }}
              </template>

              <template v-slot:item.options="{ item }">
                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn dark-2 icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list width="120" dense>
                    <v-list-item @click="viewItem(item)">
                      <v-list-item-title style="cursor: pointer">
                        <v-icon color="secondary" small> mdi-eye </v-icon>
                        View
                      </v-list-item-title>
                    </v-list-item>
                    <!-- <v-list-item @click="editItem(item)">
                      <v-list-item-title style="cursor: pointer">
                        <v-icon color="secondary" small> mdi-pencil </v-icon>
                        Edit
                      </v-list-item-title>
                    </v-list-item> -->
                    <!-- <v-list-item @click="deleteItem(item)">
                      <v-list-item-title style="cursor: pointer">
                        <v-icon color="error" small> mdi-delete </v-icon>
                        Delete
                      </v-list-item-title>
                    </v-list-item> -->
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card>
        </v-container>
      </div>
    </div>
    <Preloader v-else />
  </div>

  <NoAccess v-else />
</template>

<script>
// import "cropperjs/dist/cropper.css";
// import VueCropper from "vue-cropperjs";

let date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  .toISOString()
  .substring(0, 10);
export default {
  components: {
    // VueCropper,
  },

  data: () => ({
    disabled: false,
    visit_from_menu: false,
    visit_to_menu: false,

    date_menu: false,

    checkboxItems: [
      { label: "Item 1", value: 1 },
      { label: "Item 2", value: 2 },
      { label: "Item 3", value: 3 },
      // Add more items as needed
    ],

    payload: {
      system_user_id: "",
      visit_from: date,
      visit_to: date,
      timezone_id: 1,
      purpose_id: 1,
      first_name: "",
      last_name: "",
      gender: "Male",
      phone_number: "",
      email: "",
      visitor_company_name: "",
      id_type: 1,
      id_number: "",
      id_copy: "jpg",
      host_company_id: "",
      status_id: 1,
      date,
      updated_by: 1,
      status_phone_number: "",
      company_name: "",
      reason: "",
      company_id: "",
    },

    tab: null,

    statuses: [],
    timezones: [],
    zones: [],
    joiningDate: null,
    VisitFromMenuOpen: false,
    totalRowsCount: 0,
    showFilters: false,
    filters: {},
    isFilter: false,
    sortBy: "employee_id",
    sortDesc: false,
    server_datatable_totalItems: 1000,
    snack: false,
    snackColor: "",
    snackText: "",
    datatable_search_textbox: "",
    datatable_searchById: "",
    loadinglinear: true,
    displayErrormsg: false,
    image: "",
    mime_type: "",
    cropedImage: "",
    cropper: "",
    autoCrop: false,
    dialogCropping: false,
    tabMenu: [],
    tab: "0",
    employeeId: 0,
    employeeObject: {},
    attrs: [],
    dialog: false,
    editDialog: false,
    viewDialog: false,
    selectedFile: "",
    DialogBox: false,
    m: false,
    expand: false,
    expand2: false,
    boilerplate: false,
    right: true,
    rightDrawer: false,
    drawer: true,
    tab: null,
    selectedItem: 1,
    on: "",
    files: "",
    search: "",
    loading: false,
    //total: 0,
    next_page_url: "",
    prev_page_url: "",
    current_page: 1,
    per_page: 1000,
    ListName: "",
    color: "background",
    response: "",
    snackbar: false,
    btnLoader: false,
    max_employee: 0,

    upload: {
      name: "",
    },
    previewImage: null,
    personalItem: {},
    contactItem: {},
    emirateItems: {},
    setting: {},

    pagination: {
      current: 1,
      total: 0,
      per_page: 10,
    },
    options: {},
    Model: "Visitor",
    endpoint: "visitor",
    search: "",
    snackbar: false,
    ids: [],
    loading: false,
    //total: 0,
    titleItems: ["Mr", "Mrs", "Miss", "Ms", "Dr"],
    editedIndex: -1,
    editedItem: { name: "" },
    defaultItem: { name: "" },
    response: "",
    data: [],
    errors: [],
    purposes: [],
    users: [],
    departments: [],
    sub_departments: [],
    designations: [],
    roles: [],
    department_filter_id: "",
    dialogVisible: false,
    payloadOptions: {},

    headers: [
      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "first_name",
        value: "first_name",
        text: "Visitor",
      },
      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "timezone",
        value: "timezone",
        text: "Timezone",
      },
      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "zone_name",
        value: "zone.name",
        text: "Zone Name",
      },

      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "system_user_id",
        value: "system_user_id",
        text: "Device Id",
      },
      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "visit_from",
        value: "visit_from",
        text: "Visit From",
      },
      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "visit_to",
        value: "visit_to",
        text: "Visit To",
      },
      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "purpose",
        value: "purpose",
        text: "Purpose",
      },
      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "gender",
        value: "gender",
        text: "Gender",
      },

      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "phone_number",
        value: "phone_number",
        text: "Phone",
      },

      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "email",
        value: "email",
        text: "Email",
      },

      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "visitor_company_name",
        value: "visitor_company_name",
        text: "Company Name",
      },

      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "id_type",
        value: "id_type",
        text: "Id Type",
      },

      {
        sortable: false,
        filterSpecial: false,
        filterable: true,
        key: "id_number",
        value: "id_number",
        text: "Id Number",
      },

      // {
      //   sortable: false,
      //   filterSpecial: false,
      //   filterable: true,
      //   key: "options",
      //   value: "options",
      //   text: "Details",
      // },
    ],
    company_id: 1,
    host_list: [],
    device_ids: [],
    formAction: "Create",

    host_company_id: 0,
  }),

  async created() {
    this.company_id = this.$auth.user.company_id;
    this.loading = false;
    this.boilerplate = true;

    this.payloadOptions = {
      params: {
        per_page: 10,
        company_id: this.$auth.user.company_id,
      },
    };

    this.getPurposes();
    this.getUsers();
    this.getStatuses();
    this.getTimezone();
    this.getZones();
    this.getHostList();
  },
  mounted() {},
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  methods: {
    closeViewDialog() {
      this.viewDialog = false;
    },
    caps(str) {
      if (str == "" || str == null) {
        return "---";
      } else {
        let res = str.toString();
        return res.replace(/\b\w/g, (c) => c.toUpperCase());
      }
    },

    datatable_close() {
      this.loading = false;
      //this.datatable_search_textbox = '';
    },
    closePopup() {
      //croppingimagestep5
      this.$refs.attachment_input.value = null;
      this.dialogCropping = false;
    },
    saveCroppedImageStep2() {
      this.cropedImage = this.$refs.cropper.getCroppedCanvas().toDataURL();

      this.image_name = this.cropedImage;
      this.previewImage = this.cropedImage;

      this.dialogCropping = false;
    },
    close() {
      this.dialog = false;
      this.errors = [];
      setTimeout(() => {}, 300);
    },
    can(per) {
      return true;
      return this.$pagePermission.can(per, this);
    },

    onPageChange() {
      this.getDataFromApi();
    },
    applyFilters() {
      this.getDataFromApi();
    },
    toggleFilter() {
      // this.filters = {};
      this.isFilter = !this.isFilter;
    },
    clearFilters() {
      this.filters = {};

      this.isFilter = false;
      this.getDataFromApi();
    },
    getDataFromApi() {
      //this.loading = true;
      this.loadinglinear = true;

      this.$axios
        .get(`host/${this.$auth.user.employee.id}`)
        .then(({ data }) => {
          let { sortBy, sortDesc, page, itemsPerPage } = this.options;
          let sortedBy = sortBy ? sortBy[0] : "";
          let sortedDesc = sortDesc ? sortDesc[0] : "";
          let options = {
            params: {
              page: page,
              sortBy: sortedBy,
              sortDesc: sortedDesc,
              per_page: itemsPerPage, //this.pagination.per_page,
              company_id: this.$auth.user.company_id,
              host_company_id: data.id,
              department_id: this.department_filter_id,
              ...this.filters,
            },
          };

          this.$axios.get(`${this.endpoint}`, options).then(({ data }) => {
            this.data = data.data;
            //this.server_datatable_totalItems = data.total;
            this.pagination.current = data.current_page;
            this.pagination.total = data.last_page;

            this.totalRowsCount = data.total;

            this.data.length == 0
              ? (this.displayErrormsg = true)
              : (this.displayErrormsg = false);

            this.loadinglinear = false;
          });
        });
    },

    getHostList() {
      this.$axios
        .get(`host_list`, {
          params: {
            company_id: this.$auth.user.company_id,
          },
        })
        .then(({ data }) => {
          this.host_list = data.map((e) => ({
            id: e.id,
            name: e.employee.first_name,
          }));
        });
    },

    getPurposes() {
      let options = {
        params: {
          company_id: this.$auth.user.company_id,
        },
      };
      this.$axios.get(`purpose_list`, options).then(({ data }) => {
        this.purposes = data;
      });
    },

    getUsers() {
      this.users = [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ];
    },
    getStatuses() {
      let options = {
        model: "Visitor",
      };
      this.$axios.get("status", { params: options }).then(({ data }) => {
        this.statuses = data;
      });
    },
    getTimezone() {
      let options = {
        company_id: this.$auth.user.company_id,
      };
      this.$axios.get("timezone_list", { params: options }).then(({ data }) => {
        this.timezones = data;
        // this.timezones.unshift({
        //   timezone_name: "24HOURS",
        //   id: "1",
        //   timezone_id: "1",
        // });
      });
    },
    getZones() {
      let options = {
        company_id: this.$auth.user.company_id,
      };
      this.$axios.get("zone_list", { params: options }).then(({ data }) => {
        this.zones = data;
      });
    },
    addItem() {
      this.disabled = false;
      this.formAction = "Create";
      this.DialogBox = true;
      this.payload = {};
    },
    editItem(item) {
      this.disabled = false;
      this.formAction = "Edit";
      this.DialogBox = true;
      this.payload = item;
      this.previewImage = item.logo;
    },
    viewItem(item) {
      this.disabled = true;
      this.formAction = "View";
      this.DialogBox = true;
      this.payload = item;
      this.previewImage = item.logo;
    },
    deleteItem(item) {
      confirm(
        "Are you sure you wish to delete , to mitigate any inconvenience in future."
      ) &&
        this.$axios
          .delete(`${this.endpoint}/${item.id}`)
          .then(({ data }) => {
            this.getDataFromApi();
            this.snackbar = data.status;
            this.response = data.message;
          })
          .catch((err) => console.log(err));
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    onpick_attachment() {
      this.$refs.attachment_input.click();
    },
    attachment(e) {
      this.upload.name = e.target.files[0] || "";

      let input = this.$refs.attachment_input;
      let file = input.files;

      if (file[0].size > 1024 * 1024) {
        e.preventDefault();
        this.errors["profile_picture"] = [
          "File too big (> 1MB). Upload less than 1MB",
        ];
        return;
      }

      if (file && file[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          //croppedimage step6
          // this.previewImage = e.target.result;

          this.selectedFile = event.target.result;

          this.$refs.cropper.replace(this.selectedFile);
        };
        reader.readAsDataURL(file[0]);
        this.$emit("input", file[0]);

        this.dialogCropping = true;
      }
    },
    mapper(obj) {
      let formData = new FormData();

      for (let x in obj) {
        formData.append(x, obj[x]);
      }
      if (this.upload) {
        formData.append("logo", this.upload.name);
      }

      formData.append("company_id", this.$auth.user.company_id);

      return formData;
    },
    store_data() {
      this.$axios
        .post("/visitor", this.mapper(Object.assign(this.payload)))
        .then(({ data }) => {
          this.errors = [];
          this.snackbar = true;
          this.response = "Visitor inserted successfully";
          this.getDataFromApi();
          this.DialogBox = false;
        })
        .catch(({ response }) => {
          if (!response) {
            return false;
          }
          let { status, data, statusText } = response;

          if (status && status == 422) {
            this.errors = data.errors;
            return;
          }

          this.snackbar = true;
          this.response = statusText;
        });
    },

    update_data() {
      this.$axios
        .post(
          this.endpoint + "/" + this.payload.id,
          this.mapper(Object.assign(this.payload))
        )
        .then(({ data }) => {
          this.errors = [];
          this.snackbar = true;
          this.response = "Visitor updated successfully";
          this.getDataFromApi();
          this.DialogBox = false;
        })
        .catch(({ response }) => {
          if (!response) {
            return false;
          }
          let { status, data, statusText } = response;

          if (status && status == 422) {
            this.errors = data.errors;
            return;
          }

          this.snackbar = true;
          this.response = statusText;
        });

      // }
    },
  },
};
</script>
