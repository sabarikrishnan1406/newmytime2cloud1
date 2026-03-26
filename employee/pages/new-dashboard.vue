<template>
  <Dashboard v-if="!loading" :item="dashboardItem" :employee="employeeData" />
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      item: {
        employee: {
          leave_group_id: 1,
          title: "Mr.",
          full_name: "John Doe",
          profile_picture:
            "https://backend.mytime2cloud.com/media/employee/profile_picture/1735386653.jpg",
          employee_id: 1002,
          designation: { name: "Software Engineer" },
          branch: { branch_name: "Main Branch" },
          company: { name: "Test Company" },
          local_email: "john.doe@example.com",
          whatsapp_number: "+1234567890",
          home_country: "USA",
          reporting_manager: { first_name: "Jane" },
          show_joining_date: "2022-01-15",
          employee_id_for_payroll: 1002,
          employee_id_for_leave: 1002,
        },
        employee_id: 1002,
        p_count: 20,
        a_count: 2,
        o_count: 1,
        other_count: 1,
      },
    };
  },
  computed: {
    dashboardItem() {
      let item = this.item;
      return {
        leave_group_id: this.item?.employee?.leave_group_id,
        company_id: this.$auth?.user?.company_id || 1001,
        p_count: item?.p_count || 0,
        a_count: item?.a_count || 0,
        o_count: item?.o_count || 0,
        other_count: item?.other_count || 0,
        rating: this.$util.getRating(
          item.p_count,
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          new Date()
        ),
      };
    },
    employeeData() {
      const emp = this.$auth.user.employee || {};
      return {
        name: `${emp?.title || ""} ${emp?.full_name || ""}`,
        profile_picture: emp?.profile_picture || "",
        employee_id: this.item?.employee_id || "",
        employee_id_for_payroll: emp?.employee_id || "",
        employee_id_for_leave: emp?.employee_id || "",
        designation: emp?.designation?.name || "",
        branch: emp?.branch?.branch_name || "",
        company: this.$auth?.user?.company?.name || "Test Company",
        email: emp?.local_email || "",
        whatsapp_number: emp?.whatsapp_number || "",
        home_country: emp?.home_country || "",
        reporting_manager: emp?.reporting_manager?.first_name || "",
        joining_date: emp?.show_joining_date || "",
      };
    },
  },
  async mounted() {
    await this.getDataFromApi();
  },
  methods: {
    async getDataFromApi() {
      this.$axios
        .post(`performance-report-show`, {
          system_user_id: this.$auth.user.employee.system_user_id,
          branch_id: null,
          company_id: this.$auth.user.company_id,
          report_type: "monthly",
        })
        .then(({ data }) => {
          this.item = data;
          this.loading = false;
        });
    },
  },
};
</script>
