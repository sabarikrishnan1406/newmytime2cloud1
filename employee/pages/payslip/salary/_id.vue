<template>
  <v-card
    v-if="company_payload && company_payload.name"
    class="mx-auto"
    justify="center"
  >
    <v-card-text>
      <v-row>
        <v-col cols="12" class="reds">
          <div class="d-flex" style="border: 1px solid white">
            <v-img
              style="border-radius: 10%"
              :src="this.company_payload.logo"
              width="100px"
            ></v-img>
            <div class="ml-3 mt-3">
              <div style="border-top: 1px solid white">
                <strong>{{ this.company_payload.name }}</strong>
              </div>
              <div class="w-10">{{ this.company_payload.location }}</div>
              <div class="w-10">{{ this.company_payload.p_o_box_no }}</div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" class="reds">
          <div class="text-center pt-2">
            <h5 class="text--grey">
              <u>PAYSLIP</u>
            </h5>
          </div>
        </v-col>
        <v-col cols="12" class="reds text-right">
          <div class="text-right">
            <div class="ml-2">
              <div style="border-top: 1px solid white">
                <strong
                  >Payslip No: {{ data.payslip_number }}
                  <!-- {{ empCode }}{{ month }}{{ year }} -->
                </strong>
              </div>
              <div style="border-top: 1px solid white">
                <strong>Date: {{ data.date }} </strong>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-card outlined>
            <v-card-title> Employee Details </v-card-title>
            <v-card-text>
              <table
                style="
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 10px;
                "
              >
                <tr>
                  <th style="text-align: left; border-bottom: 1px solid #ccc">
                    Employee Name
                  </th>
                  <td style="text-align: right; border-bottom: 1px solid #ccc">
                    <span v-if="employee && employee.first_name">{{
                      employee.first_name
                    }}</span>
                    <span v-if="employee && employee.last_name">{{
                      employee.last_name
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <th style="text-align: left; border-bottom: 1px solid #ccc">
                    Employee Id
                  </th>
                  <td style="text-align: right; border-bottom: 1px solid #ccc">
                    {{ empCode }}
                  </td>
                </tr>
                <tr>
                  <th style="text-align: left; border-bottom: 1px solid #ccc">
                    Department
                  </th>
                  <td style="text-align: right; border-bottom: 1px solid #ccc">
                    {{ (data.department && data.department.name) || "---" }}
                  </td>
                </tr>
                <tr>
                  <th style="text-align: left; border-bottom: 1px solid #ccc">
                    Designation
                  </th>
                  <td style="text-align: right; border-bottom: 1px solid #ccc">
                    {{ (data.designation && data.designation.name) || "---" }}
                  </td>
                </tr>
              </table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card outlined>
            <v-card-title> Other Details </v-card-title>
            <v-card-text>
              <table
                style="
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 10px;
                "
              >
                <tr>
                  <th style="text-align: left; border-bottom: 1px solid #ccc">
                    Salary Month:
                  </th>
                  <td style="text-align: right; border-bottom: 1px solid #ccc">
                    {{ currentMonth }}, {{ currentYear }}
                  </td>
                </tr>
                <tr>
                  <th style="text-align: left; border-bottom: 1px solid #ccc">
                    Salary Type:
                  </th>
                  <td style="text-align: right; border-bottom: 1px solid #ccc">
                    {{ data.salary_type }}
                  </td>
                </tr>
                <tr>
                  <th style="text-align: left; border-bottom: 1px solid #ccc">
                    Presents
                  </th>
                  <td style="text-align: right; border-bottom: 1px solid #ccc">
                    {{ data.present }}
                  </td>
                </tr>
                <tr>
                  <th style="text-align: left; border-bottom: 1px solid #ccc">
                    Absent
                  </th>
                  <td style="text-align: right; border-bottom: 1px solid #ccc">
                    {{ data.absent }}
                  </td>
                </tr>
                <tr>
                  <th style="text-align: left; border-bottom: 1px solid #ccc">
                    Off
                  </th>
                  <td style="text-align: right; border-bottom: 1px solid #ccc">
                    {{ data.off }}
                  </td>
                </tr>
                <tr>
                  <th style="text-align: left; border-bottom: 1px solid #ccc">
                    Missing
                  </th>
                  <td style="text-align: right; border-bottom: 1px solid #ccc">
                    {{ data.missing }}
                  </td>
                </tr>
              </table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card outlined>
            <v-card-title> Earning Details </v-card-title>
            <v-card-text>
              <table
                style="
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 10px;
                "
              >
                <thead>
                  <tr>
                    <th
                      style="
                        text-align: left;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      Earnings
                    </th>
                    <th
                      style="
                        text-align: right;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in data.earnings" :key="index">
                    <td
                      style="
                        text-align: left;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      {{ caps(item.label) }}
                    </td>
                    <td
                      style="
                        text-align: right;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      {{ item.value }}
                    </td>
                  </tr>
                  <tr>
                    <th
                      style="
                        text-align: left;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      <strong>Total Earnings</strong>
                    </th>
                    <th
                      style="
                        text-align: right;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      {{ data.salary_and_earnings }}
                    </th>
                  </tr>
                </tbody>
              </table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card outlined>
            <v-card-title> Deduction Details </v-card-title>
            <v-card-text>
              <table
                style="
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 10px;
                "
              >
                <thead>
                  <tr>
                    <th
                      style="
                        text-align: left;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      Deductions
                    </th>
                    <th
                      style="
                        text-align: right;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in data.deductions" :key="index">
                    <td
                      style="
                        text-align: left;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      {{ caps(item.label) }}
                    </td>
                    <td
                      style="
                        text-align: right;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      {{ item.value }}
                    </td>
                  </tr>
                  <tr v-for="n in countdifference" :key="n">
                    <th
                      style="
                        text-align: left;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                      scope="row"
                    >
                      &nbsp;
                    </th>
                    <td
                      style="
                        text-align: right;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <th
                      style="
                        text-align: left;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                      scope="row"
                    >
                      Total Deductions
                    </th>
                    <th
                      style="
                        text-align: right;
                        padding: 5px;
                        border-bottom: 1px solid #ccc;
                      "
                    >
                      {{ data.deductedSalary }}
                    </th>
                  </tr>

                  <!-- Add more deductions rows if needed -->
                </tbody>
              </table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card outlined>
            <v-card-text class="text-right">
              <strong>Net Salary</strong>:
              {{ numberRound(this.data.earnedSubTotal) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <Preloader v-else />
</template>

<script>
export default {
  data: () => ({
    tab: null,
    Model: "Payslip",
    month: new Date().getMonth(),
    year: new Date().getFullYear().toString().slice(-2),
    currentYear: "",
    currentMonth: "",
    getdownloadLink: "",
    data: {},
    empCode: "",
    countdifference: 0,
    company_payload: {
      name: "",
      logo: "",
      member_from: "",
      expiry: "",
      max_branches: "",
      max_employee: "",
      max_devices: "",
      mol_id: "",
      p_o_box_no: "",
    },
    contact_payload: {
      name: "",
      number: "",
      position: "",
      whatsapp: "",
    },
    employee: {},
    earnings: [],
    deductions: [],
  }),
  computed: {
    // PaySlipNumber() {
    //   return this.empCode + new Date().getMonth() + 1 + this.currentYear;
    // },
  },
  created() {
    // this.loading = true;

    let today = new Date();
    let y = today.getFullYear();
    let m = today.getMonth() + 1;

    this.currentYear = y;
    this.currentMonth = today.toLocaleString("default", { month: "long" });
  },
  mounted() {
    this.getDataFromApi();
    this.getCompanyDataFromApi();
  },

  methods: {
    numberRound(val) {
      if (val) return val.toFixed(2);
    },
    can(per) {
      return this.$pagePermission.can(per, this);
    },
    can_old(per) {
      let u = this.$auth.user;
      return true;
    },
    caps(str) {
      if (str == "" || str == null) {
        return "---";
      } else {
        let res = str.toString();
        return res.replace(/\b\w/g, (c) => c.toUpperCase());
      }
    },
    getDataFromApi() {
      // this.loading = true;
      //let id = this.$route.params.id;
      let [employee_id, month, year] = this.$route.params.id.split("_");
      this.empCode = employee_id;

      this.$axios
        .get(`/payslip/${employee_id}`, {
          params: {
            company_id: this.$auth?.user?.company?.id,
            employee_id,
            month,
            year,
          },
        })
        .then(({ data }) => {
          this.data = data;
          this.employee = data.employee;
          this.earnings = data.earnings;
          this.deductions = data.deductions;

          this.countdifference = data.earnings.length - data.deductions.length;

          // this.getdownloadLink =
          //   this.$axios.defaults.baseURL +
          //   "/donwload-payslip-pdf?company_id=" +
          //   this.$auth.user.company_id +
          //   "&employee_id=" +
          //   this.data.employee_id +
          //   "&month=" +
          //   this.data.month +
          //   "&year=" +
          //   this.data.year;

          // this.loading = false;
        });
    },
    getCompanyDataFromApi() {
      let company_id = this.$auth?.user?.company?.id;
      this.$axios.get(`company/${company_id}`).then(({ data }) => {
        let r = data.record;
        this.company_payload = r;
        this.contact_payload = r.contact;

        this.preloader = false;
      });
    },
    printContent() {
      const printableContent = document.getElementById("printMe");
      const printWindow = window.open("", "", "height=1000,width=1000");
      printWindow.document.write(printableContent.innerHTML);
      printWindow.print();
    },
  },
};
</script>
