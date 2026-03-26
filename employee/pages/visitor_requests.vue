<template>
  <SnippetsCard class="px-5">
    <template #body>
      <v-row>
        <v-col cols="12" md="10">
          Visitor Requests
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
        </v-col>
        <v-col cols="12" md="2" class="text-right">
          <Calender
            class="pa-1"
            @filter-attr="filterAttr"
            :defaultFilterType="1"
            :height="'40px'"
            :default_date_from="from_date"
            :default_date_to="to_date"
          />
        </v-col>
        <v-col cols="12">
          <v-data-table
            :class="
              $isDark()
                ? 'accent custom-dark-header-for-datatable'
                : 'light-background custom-light-header-for-datatable'
            "
            :mobile-breakpoint="$store.state.isDesktop ? 0 : 2000"
            dense
            :headers="headers_table"
            :items="data"
            model-value="data.id"
            :loading="loading"
            :options.sync="options"
            :footer-props="{
              itemsPerPageOptions: [10, 50, 100, 500, 1000],
            }"
            :server-items-length="totalRowsCount"
          >
            <template v-slot:header="{ props: { headers } }">
              <tr v-if="isFilter">
                <td v-for="header in headers" :key="header.text">
                  <v-container>
                    <v-text-field
                      clearable
                      :hide-details="true"
                      v-if="header.filterable && !header.filterSpecial"
                      v-model="filters[header.value]"
                      id="header.value"
                      @input="applyFilters(header.value, $event)"
                      outlined
                      dense
                      autocomplete="off"
                    ></v-text-field>

                    <v-select
                      clearable
                      :hide-details="true"
                      @change="applyFilters('status', $event)"
                      item-value="id"
                      item-text="name"
                      v-model="filters[header.value]"
                      outlined
                      dense
                      v-else-if="
                        header.filterable &&
                        header.filterSpecial &&
                        header.value == 'purpose_id'
                      "
                      :items="[
                        { id: '', name: 'All Purposes' },
                        ...purposeList,
                      ]"
                    ></v-select>

                    <div
                      v-else-if="
                        header.filterable &&
                        header.filterSpecial &&
                        header.value == 'visit_from'
                      "
                      style="margin-top: -17px"
                    >
                      <Calender
                        @filter-attr="filterAttr"
                        :defaultFilterType="1"
                        :height="'40px'"
                        :default_date_from="from_date"
                        :default_date_to="to_date"
                      />
                    </div>
                  </v-container>
                </td>
              </tr>
            </template>
            <template v-slot:item.sno="{ item, index }">
              {{
                currentPage
                  ? (currentPage - 1) * perPage +
                    (cumulativeIndex + data.indexOf(item))
                  : "-"
              }}
            </template>

            <template v-slot:item.pic="{ item }">
              <v-img
                style="
                  border-radius: 2%;
                  width: 100px;
                  max-width: 95%;
                  min-height: 100px;
                  height: auto;
                  border: 1px solid #ddd;
                "
                :src="item.logo ? item.logo : '/no-profile-image.jpg'"
              >
              </v-img>
            </template>
            <template v-slot:item.first_name="{ item }">
              {{ item.full_name }}
            </template>

            <template v-slot:item.purpose_id="{ item }">
              {{ item.purpose.name }}
            </template>
            <template v-slot:item.visit_from="{ item }">
              {{ item.from_date_display }}
              <span v-if="item.to_date_display != item.from_date_display">
                to {{ item.to_date_display }}</span
              >
            </template>
            <template v-slot:item.time_in="{ item }">
              {{ item.time_in_display }} - {{ item.time_out_display }}
            </template>

            <template v-slot:item.phone_number="{ item }">
              {{ item.phone_number }}
              <br />
              <span class="secondary-value"> {{ item.email }}</span>
            </template>
            <template v-slot:item.visitor_company_name="{ item }"
              >{{ item.visitor_company_name }}
            </template>
            <template v-slot:item.id="{ item }">
              <span v-if="item.id_type == 1">Emirates ID</span>
              <span v-else-if="item.id_type == 2">National ID</span> <br />

              <span class="secondary-value"> {{ item.id_number }}</span>
            </template>

            <template v-slot:item.status_id="{ item }">
              <span :style="'color:' + getRelatedColor(item)">{{
                item.status
              }}</span>
            </template>
            <template v-slot:item.options="{ item }">
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn dark-2 icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list width="120" dense>
                  <v-list-item @click="updateStatus(item.id, 2)">
                    <v-list-item-title style="cursor: pointer">
                      <v-icon color="green" small> mdi-check </v-icon>
                      Approve
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="updateStatus(item.id, 3)">
                    <v-list-item-title style="cursor: pointer">
                      <v-icon color="red" small> mdi-cancel</v-icon>
                      Reject
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <div class="text-center">
        <v-dialog v-model="dialog" width="500">
          <v-card style="background: none">
            <v-card-text>
              <p class="text-center">
                <v-img
                  :src="response_image"
                  alt="Avatar"
                  height="125px"
                  width="125px"
                  style="display: inline-block"
                ></v-img>
              </p>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </SnippetsCard>
</template>

<script>
import Calender from "../components/Calender.vue";

export default {
  data: () => ({
    isFilter: false,
    filters: [],
    loading: false,
    cumulativeIndex: 1,
    perPage: 10,
    currentPage: 1,
    totalRowsCount: 0,
    options: { perPage: 10 },
    status_id: 0,
    response_image: "/sucess.png",
    dialog: false,
    message: "",
    branchesList: [],
    changeRequestDialog: false,
    Model: "Visitor Request",
    endpoint: "visitor",
    data: [],
    from_date: "",
    to_date: "",
    headers_table: [
      {
        text: "#",
        align: "left",
        sortable: false,
        value: "sno",
        filterable: false,
      },
      {
        text: "Picture",
        align: "left",
        sortable: true,
        value: "pic",
        filterable: false,
      },
      {
        text: "Name",
        align: "left",
        sortable: true,
        value: "first_name",
        filterable: true,
        filterSpecial: false,
      },
      {
        text: "Purpose",
        align: "left",
        sortable: true,
        value: "purpose_id",
        filterable: true,
        filterSpecial: true,
      },
      {
        text: "Date",
        align: "left",
        sortable: true,
        value: "visit_from",
        filterable: true,
        filterSpecial: true,
      },
      {
        text: "Time",
        align: "left",
        sortable: true,
        value: "time_in",
        filterable: true,
        filterSpecial: false,
      },
      {
        text: "Contact Number",
        align: "left",
        sortable: true,
        value: "phone_number",
        filterable: true,
        filterSpecial: false,
      },
      {
        text: "From Company",
        align: "left",
        sortable: true,
        value: "visitor_company_name",
        filterable: true,
        filterSpecial: false,
      },
      {
        text: "ID",
        align: "left",
        sortable: true,
        value: "id",
        filterable: true,
        filterSpecial: false,
      },
      {
        text: "Status",
        align: "left",
        sortable: true,
        value: "status_id",
        filterable: true,
        filterSpecial: true,
      },
      {
        text: "Options",
        align: "left",
        sortable: false,
        value: "options",
        filterable: false,
      },
    ],
    pagination: {
      current: 1,
      total: 0,
      per_page: 10,
    },
    purposeList: [],
  }),
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  created() {
    const today = new Date();

    this.from_date = today.toISOString().slice(0, 10);
    this.to_date = today.toISOString().slice(0, 10);
    this.getPurposeList();
    this.getDataFromApi();
  },
  methods: {
    filterAttr(data) {
      if (data != null) {
        this.from_date = data.from;
        this.to_date = data.to;
      } else {
        this.from_date = null;
        this.to_date = null;
      }

      this.applyFilters();
    },
    applyFilters() {
      this.getDataFromApi();
    },
    toggleFilter() {
      this.isFilter = !this.isFilter;
    },
    getPurposeList() {
      let options = {
        params: {
          company_id: this.$auth.user.company_id,
        },
      };
      this.$axios.get(`purpose_list`, options).then(({ data }) => {
        this.purposeList = data;
      });
    },
    // filterAttr(data) {
    //   this.from_date = data.from;
    //   this.to_date = data.to;
    //   this.getDataFromApi();
    // },
    updateStatus(id, status_id) {
      this.status_id = status_id;
      this.$axios
        .post(`visitor-status-update/${id}`, {
          status_id: status_id,
        })
        .then(({ data }) => {
          if (!data.status) {
            this.message = data.message;
            this.response_image = "/fail.png";
            setTimeout(() => (this.dialog = false), 3000);
            return;
          }
          if (status_id == 2) {
            this.response_image = "/success.png";
            this.message = " Visitor status has been Approved.";
          } else {
            this.response_image = "/fail.png";
            this.message = " Visitor status has been Rejected.";
          }

          this.dialog = true;

          this.getDataFromApi();

          setTimeout(() => (this.dialog = false), 3000);
        });
    },
    getRelatedColor(item) {
      let colors = {
        1: "purple",
        3: "red",
        2: "green",
        UNKNOWN: "purple",
      };
      return colors[item.status_id || "UNKNOWN"];
    },
    getDataFromApi() {
      this.loading = true;
      let { sortBy, sortDesc, page, itemsPerPage } = this.options;
      let sortedBy = sortBy ? sortBy[0] : "";
      let sortedDesc = sortDesc ? sortDesc[0] : "";
      let options = {
        params: {
          page: page,
          sortBy: sortedBy,
          sortDesc: sortedDesc,
          per_page: itemsPerPage,
          pagination: true,
          company_id: this.$auth.user.company_id,
          UserID: this.$auth.user.employee.system_user_id,
          from_date: this.from_date,
          to_date: this.to_date,
          ...this.filters,
        },
      };
      this.$axios.get(this.endpoint, options).then(({ data }) => {
        this.data = data.data.filter((e) => e.host);
        this.pagination.current = data.current_page;
        this.pagination.total = data.last_page;
        this.loading = false;
        this.totalRowsCount = data.total;
      });
    },
  },
  components: { Calender },
};
</script>
