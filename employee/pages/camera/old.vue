<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="responseDialog" max-width="700px">
        <v-card>
          <v-card-title dark class="popup_background">
            <span dense> {{ responseStatus }} </span>
            <v-spacer></v-spacer>
            <v-icon @click="responseDialog = false" outlined>
              mdi mdi-close-circle
            </v-icon>
          </v-card-title>
          <v-card-text class="ma-2"> {{ response }} </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- <v-toolbar-title class="text-center pt-15"> Visitor Registration </v-toolbar-title> -->
    <v-toolbar-title class="primary text-center white--text pa-2 mt-5">
      Visitor Registration
    </v-toolbar-title>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="6">
          <div class="text-center" style="margin: 0 auto; max-width: 200px">
            <v-img
              style="
                width: 100%;
                max-height: 200px;
                border: 1px solid #6946dd;
                border-radius: 50%;
                margin: 0 auto;
              "
              :src="previewImage || '/no-profile-image.jpg'"
            ></v-img>
            <br />
            <div class="text-center">
              <CameraComponent @captured-image="(e) => (previewImage = e)" />

              <!-- <v-btn small class="primary" @click="onpick_attachment"
                >{{ !upload.name ? "Upload" : "Change" }} Image
                <v-icon right dark>mdi-cloud-upload</v-icon>
              </v-btn> -->
            </div>

            <!-- <input
              required
              type="file"
              @change="attachment"
              style="display: none"
              accept="image/*"
              ref="attachment_input"
            /> -->

            <!-- <span
              v-if="errors && errors.profile_picture"
              class="text-danger mt-2"
              >{{ errors.profile_picture[0] }}</span
            > -->
          </div>
        </v-col>
        <v-col cols="12" class="pt-5">
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="6">
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
                    :hide-details="!errors.visit_from"
                    :error-messages="
                      errors && errors.visit_from ? errors.visit_from[0] : ''
                    "
                    v-model="payload.visit_from"
                    append-icon="mdi-calendar"
                    outlined
                    dense
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    label="Visit From"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="payload.visit_from" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="visit_from_menu = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.visit_from_menu_ref.save(payload.visit_from)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="6">
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
                    :hide-details="!errors.visit_to"
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
                    label="Visit From"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="payload.visit_to" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="visit_to_menu = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.visit_to_menu_ref.save(payload.visit_to)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="6">
              <v-select
                v-model="payload.purpose_id"
                :items="purposes"
                dense
                outlined
                item-text="name"
                item-value="id"
                :hide-details="!errors.purpose_id"
                label="Purpose"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="6">
              <v-select
                :items="[`Male`, `Female`]"
                v-model="payload.gender"
                dense
                outlined
                :hide-details="!errors.gender"
                :error-messages="
                  errors && errors.gender ? errors.gender[0] : ''
                "
                label="Gender"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="6">
              <v-text-field
                v-model="payload.first_name"
                dense
                outlined
                :hide-details="!errors.first_name"
                :error-messages="
                  errors && errors.first_name ? errors.first_name[0] : ''
                "
                label="First Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="6">
              <v-text-field
                v-model="payload.last_name"
                dense
                outlined
                :hide-details="!errors.last_name"
                :error-messages="
                  errors && errors.last_name ? errors.last_name[0] : ''
                "
                label="Last Name"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="4">
              <v-text-field
                v-model="payload.phone_number"
                dense
                outlined
                :hide-details="!errors.phone_number"
                :error-messages="
                  errors && errors.phone_number ? errors.phone_number[0] : ''
                "
                label="Phone Number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="4">
              <v-text-field
                v-model="payload.email"
                dense
                outlined
                :hide-details="!errors.email"
                :error-messages="errors && errors.email ? errors.email[0] : ''"
                label="Email Address (optional)"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="4">
              <v-text-field
                v-model="payload.visitor_company_name"
                dense
                outlined
                :hide-details="!errors.visitor_company_name"
                :error-messages="
                  errors && errors.visitor_company_name
                    ? errors.visitor_company_name[0]
                    : ''
                "
                label="Your Company Name"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="6">
              <v-select
                v-model="payload.id_type"
                :items="[
                  { id: 1, name: `Emirates ID` },
                  { id: 2, name: `National ID` },
                ]"
                dense
                outlined
                item-text="name"
                item-value="id"
                :hide-details="!errors.id_type"
                :error-messages="
                  errors && errors.id_type ? errors.id_type[0] : ''
                "
                label="ID Type"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4" lg="6">
              <v-text-field
                v-model="payload.id_number"
                dense
                outlined
                :hide-details="!errors.id_number"
                :error-messages="
                  errors && errors.id_number ? errors.id_number[0] : ''
                "
                label="ID Number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-btn block :loading="loading" color="primary" @click="store_data">
            Register
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
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

  layout: "login",
  auth: false,

  data: () => ({
    decryptedID: "",
    responseStatus: "",
    responseDialog: false,
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

      status_id: 1,
      date,
      updated_by: 1,
      status_phone_number: "",
      company_name: "",
      reason: "",
      company_id: 0,
      host_company_id: 0,
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
    headers: [],
    titleItems: ["Mr", "Mrs", "Miss", "Ms", "Dr"],
    editedIndex: -1,
    editedItem: { name: "" },
    defaultItem: { name: "" },
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

    host_company_list: [],
    device_ids: [],
    formAction: "Create",
  }),
  mounted() {},
  async created() {
    this.loading = false;
    this.boilerplate = true;
    // let params = this.$route.params.id.split("-");
    let params = "2-2".split("-");

    this.payload.company_id = params[0];
    this.payload.host_company_id = params[1];
    await this.getPurposes();
  },

  methods: {
    closeViewDialog() {
      this.viewDialog = false;
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
    async getPurposes() {
      this.$axios
        .get(`purpose_list`, {
          params: {
            company_id: this.payload.company_id,
          },
        })
        .then(({ data }) => {
          this.purposes = data;
        });
    },

    onpick_attachment() {
      this.$refs.attachment_input.click();
    },
    attachment(e) {
      this.upload.name = e.target.files[0] || "";

      let input = this.$refs.attachment_input;
      let file = input.files;

      // if (file[0].size > 1024 * 1024) {
      //   e.preventDefault();
      //   this.errors["profile_picture"] = [
      //     "File too big (> 1MB). Upload less than 1MB",
      //   ];
      //   return;
      // }

      if (file && file[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          //croppedimage step6
          this.previewImage = e.target.result;
          // this.selectedFile = event.target.result;

          // this.$refs.cropper.replace(this.selectedFile);
        };
        reader.readAsDataURL(file[0]);
        this.$emit("input", file[0]);

        // this.dialogCropping = true;
      }
    },
    mapper(obj) {
      let formData = new FormData();

      for (let x in obj) {
        formData.append(x, obj[x]);
      }
      formData.append("logo", this.previewImage);
      formData.append("company_id", this.payload.company_id);
      formData.append("host_company_id", this.payload.host_company_id);

      return formData;
    },
    store_data() {
      this.$axios
        .post("visitor-register", this.mapper(this.payload))
        .then(({ data }) => {
          this.errors = [];
          this.responseDialog = true;
          this.response = data.message = "Registration has been submitted.";
          this.responseStatus = "Success";

          this.getDataFromApi();
          this.DialogBox = false;
        })
        .catch(({ response }) => {
          if (!response) return false;

          this.responseDialog = true;
          this.responseStatus = "Fail";
          this.response = response;

          // let { status, data, statusText } = response;

          // if (status && status == 422) {
          //   this.errors = data.errors;
          //   return;
          // }

          // this.response = statusText;
        });
    },
  },
};
</script>
