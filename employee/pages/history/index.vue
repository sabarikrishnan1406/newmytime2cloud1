<template>
  <div>
    <div id="map" style="height: 100vh"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      geocoder: null,
      infowindow: null,
      locations: [],
      initialLatLon: [],
    };
  },
  mounted() {
    this.loadGoogleMapsScript(this.initMap);
  },
  created() {
    this.plotLocations();
  },
  methods: {
    loadGoogleMapsScript(callback) {
      if (window.google && window.google.maps) {
        callback();
        return;
      }
      //console.log(process.env.MapApiKey);
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.MapApiKey}`;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", callback);
      document.head.appendChild(script);
    },

    async plotLocations() {
      try {
        const employee = this.$auth.user.employee;
        this.UserID = employee.system_user_id;

        const response = await this.$axios.get(`/realtime_location`, {
          params: {
            company_id: this.$auth.user.company_id,
            UserID: this.UserID,
            // date: this.$route.params.date,
          },
        });

        const data = response.data.data;
        if (!data || data.length === 0) {
          console.error("No location data available.");
          return;
        }

        const firstLocation = data[0];
        this.initialLatLon = [firstLocation.latitude, firstLocation.longitude];

        const routeCoordinates = data.map(({ latitude, longitude }) => ({
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
        }));

        const routePath = new google.maps.Polyline({
          path: routeCoordinates,
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        routePath.setMap(this.map);

        const infowindow = new google.maps.InfoWindow();

        data.forEach(({ latitude, longitude, datetime }) => {
          //console.log(datetime);
          const position = {
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
          };
          const marker = new google.maps.Marker({ position, map: this.map });

          marker.addListener("click", () => {
            this.geocoder
              .geocode({ location: position })
              .then((response) => {
                if (response.results[0]) {
                  infowindow.setContent(datetime);
                  infowindow.open(this.map, marker);
                } else {
                  window.alert("No results found");
                }
              })
              .catch((e) => window.alert("Geocoder failed due to: " + e));
          });
        });
      } catch (error) {
        console.error("Error fetching data from the API:", error);
      }
    },

    initMap() {
      this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: 25.276987, lng: 55.296249 },
      });
      this.geocoder = new google.maps.Geocoder();
      this.infowindow = new google.maps.InfoWindow();
    },
  },
};
</script>
