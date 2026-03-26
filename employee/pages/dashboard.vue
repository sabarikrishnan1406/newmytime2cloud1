<template>
  <span>
    <!-- Show only on mobile devices -->
    <v-responsive class="d-block d-md-none">
      <Mobile />
    </v-responsive>

    <!-- Hide on mobile devices -->
    <v-responsive class="d-none d-md-block">
      <v-container fluid>
        <v-row>
          <!-- Left Column -->
          <v-col cols="12" md="6">
            <v-row no-gutters>
              <v-col cols="12">
                <SnippetsCard>
                  <template #body>
                    <DashboardAttendance :company_id="company_id" :system_user_id="system_user_id" :employee_id="employee_id" />
                  </template>
                </SnippetsCard>
              </v-col>
            </v-row>
            <v-row no-gutters class="mt-10">
              <v-col>
                <SnippetsCard>
                  <template #body>
                    <DashboardLogs :company_id="company_id" :system_user_id="system_user_id" :employee_id="employee_id" />
                  </template>
                </SnippetsCard>
              </v-col>
            </v-row>
          </v-col>

          <!-- Right Column -->
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <SnippetsCard>
                      <template #body>
                        <DashboardAVGClockIn :company_id="company_id" :system_user_id="system_user_id" :employee_id="employee_id" :shift_type_id="shift_type_id" />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-10">
                    <SnippetsCard>
                      <template #body>
                        <DashboardAttendanceStatus :company_id="company_id" :system_user_id="system_user_id" :employee_id="employee_id" />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-10">
                    <SnippetsCard>
                      <template #body>
                        <VerticalProgress :company_id="company_id" :system_user_id="system_user_id" :employee_id="employee_id" />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-10">
                    <SnippetsCard>
                      <template #body>
                        <DashboardBestAndLeastEmployee :company_id="company_id" :system_user_id="system_user_id" :employee_id="employee_id" />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-7">
                    <SnippetsCard>
                      <template #body>
                        <DashboardLeaveQuotta :company_id="company_id" :system_user_id="system_user_id" :employee_id="employee_id" :leave_group_id="leave_group_id"/>
                      </template>
                    </SnippetsCard>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <SnippetsCard>
                      <template #body>
                        <DashboardCurrentMonthAttendance :company_id="company_id" :system_user_id="system_user_id" :employee_id="employee_id" />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-7">
                    <SnippetsCard>
                      <template #body>
                        <DashboardUpcomingHoliday
                          :company_id="company_id" :system_user_id="system_user_id" :employee_id="employee_id"
                        />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-7">
                    <SnippetsCard>
                      <template #body>
                        <DashboardRemaingHours :company_id="company_id" :system_user_id="system_user_id" :employee_id="employee_id" />
                      </template>
                    </SnippetsCard>
                  </v-col>
                  <v-col cols="12" class="mt-10">
                    <SnippetsCard>
                      <template #body>
                        <DashboardAnnouncement :company_id="company_id" :system_user_id="system_user_id" :employee_id="employee_id" />
                      </template>
                    </SnippetsCard>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-responsive>
  </span>
</template>
<script>
export default {
  computed: {
    company_id() {
      return this.$auth?.user?.company_id ?? null;
    },
    system_user_id() {
      return this.$auth?.user?.employee?.system_user_id ?? null;
    },
    employee_id() {
      return this.$auth?.user?.employee?.employee_id ?? null;
    },
    shift_type_id() {
      return this.$auth?.user?.employee?.schedule_active?.shift_type_id ?? null;
    },
    leave_group_id() {
      return this.$auth?.user?.employee?.leave_group_id ?? null;
    },
    
  },
};
</script>

