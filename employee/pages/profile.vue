<template>
  <div v-if="employeeObject">
    <v-row>
            <v-col cols="12" md="6">
              <v-expansion-panels v-model="panel1" multiple :light="!$isDark()">
                <v-expansion-panel
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <v-expansion-panel-header>
                    <h5>
                      <v-icon>mdi-contacts</v-icon> <span>Contact Details</span>
                    </h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <table class="view-profile-table-lineheight">
                      <tr>
                        <td><h4>Phone Number</h4></td>
                        <td>
                          :
                          {{
                            employeeObject.phone_number
                              ? employeeObject.phone_number
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td><h4>Whatsapp Number</h4></td>
                        <td>
                          :
                          {{
                            employeeObject.whatsapp_number
                              ? employeeObject.whatsapp_number
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td><h4>Alternate Email</h4></td>
                        <td>
                          :
                          {{
                            employeeObject.local_email
                              ? employeeObject.local_email
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td><h4>Phone Relative Number</h4></td>
                        <td>
                          :
                          {{
                            employeeObject.phone_relative_number
                              ? employeeObject.phone_relative_number
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td><h4>Relation</h4></td>
                        <td>
                          :
                          {{
                            employeeObject.relation
                              ? employeeObject.relation
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td><h4>Local Address</h4></td>
                        <td>
                          :
                          {{
                            employeeObject.local_address
                              ? employeeObject.local_address
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td><h4>Local City</h4></td>
                        <td>
                          :
                          {{
                            employeeObject.local_city
                              ? employeeObject.local_city
                              : "---"
                          }}
                        </td>
                      </tr>

                      <tr>
                        <td><h4>Local Country</h4></td>
                        <td>
                          :
                          {{
                            employeeObject.local_country
                              ? employeeObject.local_country
                              : "---"
                          }}
                        </td>
                      </tr>
                    </table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <v-expansion-panel-header>
                    <h5>
                      <v-icon>mdi-home-account</v-icon> Home Country - Details
                    </h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <table class="view-profile-table-lineheight">
                      <tr>
                        <td>
                          <h4>Address</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.home_address
                              ? employeeObject.home_address
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Tel</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.home_tel
                              ? employeeObject.home_tel
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Mobile</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.home_mobile
                              ? employeeObject.home_mobile
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Fax</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.home_fax
                              ? employeeObject.home_fax
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>City</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.home_city
                              ? employeeObject.home_city
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>State</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.home_state
                              ? employeeObject.home_state
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Country</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.home_country
                              ? employeeObject.home_country
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Personal Email</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.home_email
                              ? employeeObject.home_email
                              : "---"
                          }}
                        </td>
                      </tr>
                    </table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <v-expansion-panel-header>
                    <h5><v-icon>mdi-passport</v-icon> Passport Details</h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <table class="view-profile-table-lineheight">
                      <tr>
                        <td>
                          <h4>Passport No</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.passport
                              ? employeeObject.passport.passport_no
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Place Of Issue</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.passport
                              ? employeeObject.passport.place_of_issues
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Issue Date</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.passport
                              ? employeeObject.passport.issue_date
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Expiry Date</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.passport
                              ? employeeObject.passport.expiry_date
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Country</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.passport
                              ? employeeObject.passport.country
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Note</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.passport
                              ? employeeObject.passport.note
                              : "---"
                          }}
                        </td>
                      </tr>
                    </table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <v-expansion-panel-header>
                    <h5>
                      <v-icon>mdi-passport-biometric</v-icon> Emirates Details
                    </h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <table class="view-profile-table-lineheight">
                      <tr>
                        <td>
                          <h4>Emirate Id</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.emirate
                              ? employeeObject.emirate.emirate_id
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Nationality</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.emirate
                              ? employeeObject.emirate.nationality
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Issue Date</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.emirate
                              ? employeeObject.emirate.issue
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Expiry Date</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.emirate
                              ? employeeObject.emirate.expiry
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Date of Birth</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.emirate
                              ? employeeObject.emirate.date_of_birth
                              : "---"
                          }}
                        </td>
                      </tr>
                    </table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <v-expansion-panel-header>
                    <h5><v-icon>mdi-passport-biometric</v-icon> Visa</h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <table class="view-profile-table-lineheight">
                      <tr>
                        <td>
                          <h4>Visa Number</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.visa
                              ? employeeObject.visa.visa_no
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Place Of Issue</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.visa
                              ? employeeObject.visa.place_of_issues
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Issue Date</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.visa
                              ? employeeObject.visa.issue_date
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Expiry Date</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.visa
                              ? employeeObject.visa.expiry_date
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Country</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.visa
                              ? employeeObject.visa.country
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Labour No</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.visa
                              ? employeeObject.visa.note
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Note</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.visa
                              ? employeeObject.visa.note
                              : "---"
                          }}
                        </td>
                      </tr>
                    </table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <v-expansion-panel-header>
                    <h5><v-icon>mdi-account</v-icon> Host Info</h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="mt-3">
                      <DetailView
                        @success="(e) => setLinkAndQrCode(e)"
                        endpoint="host"
                        :cols="cols"
                      />
                    </div>

                    <div v-if="detail_data && detail_data.id">
                      <v-avatar v-if="qrCodeDataURL" size="125" tile>
                        <img :src="qrCodeDataURL" alt="Avatar" />
                      </v-avatar>
                      <span> {{ fullLink }} </span>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
            <v-col cols="12" md="6">
              <v-expansion-panels multiple v-model="panel" :light="!$isDark()">
                <v-expansion-panel
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <v-expansion-panel-header>
                    <h5><v-icon>mdi-bank</v-icon> Bank Details</h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <table class="view-profile-table-lineheight">
                      <tr>
                        <td>
                          <h4>Bank Name</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.bank
                              ? employeeObject.bank.bank_name
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Bank Address</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.bank
                              ? employeeObject.bank.address
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Account No</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.bank
                              ? employeeObject.bank.account_no
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Account Name</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.bank
                              ? employeeObject.bank.account_title
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>IBAN</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.bank
                              ? employeeObject.bank.iban
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Other Text</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.bank
                              ? employeeObject.bank.other_text
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Other Value</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.bank
                              ? employeeObject.bank.other_value
                              : "---"
                          }}
                        </td>
                      </tr>
                    </table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <v-expansion-panel-header>
                    <h5>
                      <v-icon>mdi-file-account-outline</v-icon> Documents({{
                        document_list.length
                      }})
                    </h5></v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <table
                      style="
                        width: 100%;
                        border-collapse: collapse;
                        margin: 5px;
                      "
                    >
                      <thead>
                        <tr>
                          <th style="padding: 8px; text-align: left">Title</th>
                          <th style="padding: 8px; text-align: left">
                            Document
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(document, index) in document_list"
                          :key="index"
                        >
                          <td
                            style="
                              padding: 8px;
                              text-align: left;
                              border-top: 1px solid #ddd;
                            "
                          >
                            {{ document.title }}
                          </td>
                          <td
                            style="
                              padding: 8px;
                              text-align: left;
                              border-top: 1px solid #ddd;
                            "
                          >
                            <a
                              :href="document.attachment"
                              download
                              target="_blank"
                            >
                              <v-icon color="primary"> mdi-download </v-icon>
                            </a>
                          </td>
                        </tr>
                        <!-- Add more rows as needed -->
                      </tbody>
                    </table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <v-expansion-panel-header>
                    <h5><v-icon>mdi-school</v-icon> Qualification Details</h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <table class="view-profile-table-lineheight">
                      <tr>
                        <td>
                          <h4>Certificate</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.qualification.certificate
                              ? employeeObject.qualification.certificate
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>College</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.qualification.collage
                              ? employeeObject.qualification.collage
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Start Date</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.qualification.start
                              ? employeeObject.qualification.start
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>End Date</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.qualification.end
                              ? employeeObject.qualification.end
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Type</h4>
                        </td>
                        <td>
                          :
                          {{
                            employeeObject.bank.type
                              ? employeeObject.bank.type
                              : "---"
                          }}
                        </td>
                      </tr>
                    </table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <v-expansion-panel-header>
                    <h5><v-icon>mdi-cog</v-icon> Settings</h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <table
                      style="width: 100%; font-size: 14px; line-height: 30px"
                    >
                      <tr>
                        <td><h4>Employee Status</h4></td>
                        <td class="text-right" style="float: right">
                          <v-switch
                            disabled
                            color="success"
                            class="mt-0 ml-2"
                            v-model="employeeObject.status"
                          ></v-switch>
                        </td>
                      </tr>
                      <tr>
                        <td><h4>Web Login Access</h4></td>
                        <td class="text-right" style="float: right">
                          <v-switch
                            disabled
                            color="success"
                            class="mt-0 ml-2"
                            v-model="employeeObject.user.web_login_access"
                          ></v-switch>
                        </td>
                      </tr>
                      <tr>
                        <td><h4>Mobile App Login Access</h4></td>
                        <td class="text-right" style="float: right">
                          <v-switch
                            disabled
                            color="success"
                            class="mt-0 ml-2"
                            v-model="
                              employeeObject.user.mobile_app_login_access
                            "
                          ></v-switch>
                        </td>
                      </tr>

                      <tr>
                        <td><h4>Over Time</h4></td>
                        <td class="text-right" style="float: right">
                          <div class="text-overline mb-1">
                            <v-switch
                              disabled
                              color="success"
                              class="mt-0 ml-2"
                              v-model="employeeObject.overtime"
                            ></v-switch>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td><h4>Enable Whatsapp OTP</h4></td>
                        <td>
                          <div class="text-overline mb-1" style="float: right">
                            <v-switch
                              disabled
                              color="success"
                              class="mt-0 ml-2"
                              v-model="employeeObject.user.enable_whatsapp_otp"
                            ></v-switch>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <h4>Live Tracking</h4>
                        </td>
                        <td>
                          <div class="text-overline mb-1" style="float: right">
                            <v-switch
                              disabled
                              color="success"
                              class="mt-0 ml-2"
                              v-model="employeeObject.user.tracking_status"
                            ></v-switch>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Leave Group</h4>
                        </td>
                        <td class="text-right">
                          {{
                            employeeObject.leave_group
                              ? employeeObject.leave_group.group_name
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h4>Leave Reporting Manger</h4>
                        </td>
                        <td class="text-right">
                          {{
                            employeeObject.reporting_manager
                              ? employeeObject.reporting_manager.first_name +
                                " " +
                                employeeObject.reporting_manager.last_name
                              : "---"
                          }}
                        </td>
                      </tr>
                    </table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel
                  :class="
                    $isDark()
                      ? 'accent white--text'
                      : 'light-background black--text'
                  "
                >
                  <v-expansion-panel-header>
                    <h5><v-icon>mdi-cash</v-icon> Salary Information</h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <table
                      v-if="employeeObject.payroll"
                      class="employee-table view-profile-table-lineheight"
                      style="width: 100%"
                    >
                      <tr style="border: 0px solid #ddd">
                        <td><h4>Effective Date</h4></td>
                        <td class="text-left">
                          :
                          {{
                            employeeObject.payroll &&
                            employeeObject.payroll.effective_date_formatted
                              ? employeeObject.payroll.effective_date_formatted
                              : "---"
                          }}
                        </td>
                      </tr>
                      <tr style="border: 0px solid #ddd">
                        <td><h4>Basic Salary</h4></td>

                        <td class="text-left">
                          :
                          {{
                            employeeObject.payroll &&
                            employeeObject.payroll.basic_salary
                              ? employeeObject.payroll.basic_salary
                              : "---"
                          }}
                        </td>
                      </tr>

                      <tr
                        style="border: 0px solid #ddd"
                        v-for="(item, index) in employeeObject.payroll.earnings"
                        :key="index"
                      >
                        <td>
                          <h4>{{ item.label }}</h4>
                        </td>
                        <td class="text-left">: {{ item.value }}</td>
                      </tr>
                    </table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
  </div>
</template>
<script>
import DetailView from "../components/DetailView.vue";

export default {
  components: { DetailView },

  data: () => ({
    panel: [],
    panel1: [],
    employeeObject: null,
    switchValue: true,
    image: "",
    mime_type: "",
    cropedImage: "",
    cropper: "",
    autoCrop: false,
    selectedFile: "",
    upload_edit: {
      name: "",
    },
    drawer: false,
    group: null,
    attrs: [],
    dialog: false,
    editDialog: false,
    tab: null,
    m: false,
    expand: false,
    expand2: false,
    boilerplate: false,
    right: true,
    rightDrawer: false,
    tab: null,
    selectedItem: 1,

    on: "",
    color: "background",
    files: "",
    Model: "Employee",
    endpoint: "employee",
    search: "",
    loading: false,
    total: 0,
    next_page_url: "",
    prev_page_url: "",
    current_page: 1,
    per_page: 8,
    response: "",
    ListName: "",
    snackbar: false,
    btnLoader: false,
    max_employee: 0,
    employee: {
      title: "",
      display_name: "",
      employee_id: "",
      system_user_id: "",
      profile_picture: "",
      employee_role_id: "",
    },
    upload: {
      name: "",
    },
    previewImage: null,
    snackbar: false,
    ids: [],
    loading: false,
    total: 0,
    titleItems: ["Mr", "Mrs", "Miss", "Ms", "Dr"],
    editedIndex: -1,
    response: "",
    departments: [],
    sub_departments: [],
    designations: [],
    roles: [],
    data: [],
    errors: [],
    departments: [],
    department_id: "",
    payloadOptions: {},
    last_login: {},
    document_list: [],
    detail_data: {},
    cols: [
      `flat_number`,
      `floor_number`,
      `number`,
      `emergency_phone`,
      `open_time`,
      `close_time`,
      `zone_id`,
    ],

    qrCodeDataURL: "",
    originalURL: `https://mytime2cloud.com/register/visitor/`,
    fullLink: "",
  }),

  async created() {
    let options = {
      params: {
        id: this.$auth.user.employee.id,
        company_id: this.$auth.user.company_id,
        // department_id: this.department_filter_id,
      },
    };

    this.$axios.get("employee", options).then(({ data }) => {
      if (data.data[0]) this.employeeObject = data.data[0];
      if (this.employeeObject && this.employeeObject.leave_group_id)
        // this.gotoGroupDetails(
        //   this.employeeObject.leave_group_id,
        //   this.employeeObject.employee_id,
        //   this.employeeObject.first_name
        // );
        setTimeout(() => {
          this.getLastLogin();
        }, 2000);
    });
    setTimeout(() => {
      this.panel = this.$store.state.isDesktop == true ? [0, 1] : [];
      this.panel1 = this.$store.state.isDesktop == true ? [0, 1] : [];
    }, 2000);
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    setLinkAndQrCode(e) {
      this.detail_data = e;
      this.fullLink = `${this.originalURL}${this.$auth.user.company_id}-${e.id}`;
      this.generateQRCode(this.fullLink);
    },
    async generateQRCode(fullLink) {
      try {
        this.qrCodeDataURL = await this.$qrcode.generate(fullLink);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    },
    getLastLogin() {
      //
      if (this.employeeObject)
        this.$axios
          .get(`activity/${this.employeeObject.user_id}?action=Login`)
          .then(({ data }) => {
            this.last_login = data.date_time;
          });
    },
  },
};
</script>
