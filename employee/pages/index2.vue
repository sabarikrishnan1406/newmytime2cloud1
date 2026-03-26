<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">View Attendance</v-btn>
    </template>
    <v-card outlined>
        <v-container>
            <v-row>
              <v-col cols="4">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-avatar size="150">
                      <img
                        :src="employee.profilePicture"
                        alt="Profile Picture"
                        style="max-width: 100px; max-height: 100px"
                      />
                    </v-avatar>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <table style="width: 100%">
                      <tr class="text-left">
                        <td>
                          <strong>EID:</strong>
                        </td>
                        <td class="text-right">{{ employee.id }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">
                          <strong>Full Name:</strong>
                        </td>
                        <td class="text-right">{{ employee.id }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">
                          <strong>Branch:</strong>
                        </td>
                        <td class="text-right">{{ employee.id }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">
                          <strong>Dept:</strong>
                        </td>
                        <td class="text-right">{{ employee.id }}</td>
                      </tr>
                    </table>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      employee: {
        id: "123456",
        name: "John Doe",
        email: "john.doe@example.com",
        profilePicture:
          "https://backend.mytime2cloud.com/media/employee/profile_picture/1696868606.jpg", // URL to the profile picture
      },
      attendanceLogs: [
        { date: "2024-01-01", time: "08:00 AM" },
        { date: "2024-01-02", time: "08:15 AM" },
        { date: "2024-01-03", time: "08:10 AM" },
        // You can populate this array with actual attendance logs of the employee
      ],
    };
  },
};
</script>
