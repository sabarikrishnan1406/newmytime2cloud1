<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-select
          dense
          outlined
          hide-details
          v-model="company_id"
          :items="companies"
          item-text="name"
          item-value="id"
          label="Company Id"
          @change="getDepartments"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-select
          dense
          outlined
          hide-details
          @change="getShiftTypeId"
          v-model="shift_type"
          :items="shift_types"
          item-text="text"
          item-value="value"
          label="Select Shift Type"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          label="Select Department"
          dense
          outlined
          hide-details
          x-small
          item-value="id"
          item-text="name"
          v-model="department_id"
          :items="departments"
          @change="getEmployeeIds"
          placeholder="Department"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          dense
          multiple
          outlined
          hide-details
          x-small
          item-value="system_user_id"
          item-text="first_name"
          v-model="employee_ids"
          :items="employees"
          placeholder="Employees"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12">
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              dense
              outlined
              hide-details
              v-model="date"
              label="Date"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12">
        <v-btn class="indigo" block dark @click="submit">Submit</v-btn>
      </v-col>
      <v-col cols="12" v-if="response">
        <v-card outlined min-height="100" style="overflow: scroll">
          <ul class="mt-1">
            <li>{{ response }}</li>
          </ul>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      selectedItem: null,
      employeeIds: null,
      employees: [],
      departments: [],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu2: false,
      datePicker: false,
      company_id: 5,
      shift_type: "renderFiloRequest",
      department_id: 0,
      employee_ids: [],
      companies: [],
      shift_types: [
        {
          text: "Filo",
          value: `renderFiloRequest`,
        },
        {
          text: "Multi",
          value: `renderMultiRequest`,
        },
        {
          text: "Single",
          value: `renderSingleRequest`,
        },
      ],
      shift_type_id: 1,
      response: null,
      options: {},
      shift_type_ids: {
        renderFiloRequest: 1,
        renderMultiRequest: 2,
        renderSingleRequest: 6,
      },
    };
  },
  async created() {
    this.$axios.get("https://backend.eztime.online/api/company").then(({ data }) => {
      this.companies = data.data;
    });
    await this.getDepartments();
    await this.getEmployeeIds();
  },
  methods: {
    getShiftTypeId() {
      this.shift_type_id = this.shift_type_ids[this.shift_type];
    },
    async getDepartments() {
      this.options = {
        params: {
          per_page: 1000,
          company_id: this.company_id,
        },
      };
      const { data } = await this.$axios.get(`https://backend.eztime.online/api/departments`, this.options);
      this.departments = data.data;
    },
    getEmployeeIds() {
      let options = {
        params: {
          department_ids: [this.department_id],
          per_page: 1000,
          company_id: this.company_id,
        },
      };

      this.$axios.get("https://backend.eztime.online/api/employeesByDepartment", options).then(({ data }) => {
        this.employees = data.data;
        this.employee_ids = data.data.map(e => e.system_user_id);

      });
    },
    submit() {
      let payload = {
        company_id: this.company_id,
        date: this.date,
        shift_type_id: this.shift_type_id,
        UserIds: this.employee_ids,
      };
      this.$axios.post(`https://backend.eztime.online/api/${this.shift_type}`, payload).then(({ data }) => {
        this.response = data;
      });
    },
  },
};
</script>
