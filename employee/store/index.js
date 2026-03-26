// holds your root state
export const state = () => ({
  locationData: {},
  locationData: {},
  navigator: {},
  disableCheckInButton: false,
  disableCheckOutButton: true,

  latitude: null,
  longitude: null,
  currentDate: null,
  initialPunch: true,
  isDesktop: true,
  login_token: "",
  email: "",
  password: "",
});

// contains your mutations
export const mutations = {
  login_token(state, value) {
    state.login_token = value;
  },
  email(state, value) {
    state.email = value;
  },
  password(state, value) {
    state.password = value;
  },
  locationData(state, value) {
    state.locationData = value;
  },
  isDesktop(state, value) {
    state.isDesktop = value;
  },

  locationError(state, value) {
    state.locationError = value;
  },
  navigator(state, value) {
    state.navigator = value;
  },
  disableCheckInButton(state, value) {
    state.disableCheckInButton = value;
  },
  disableCheckOutButton(state, value) {
    state.disableCheckOutButton = value;
  },

  latitude(state, value) {
    state.latitude = value;
  },
  longitude(state, value) {
    state.longitude = value;
  },
  currentDate(state, value) {
    state.currentDate = value;
  },
  initialPunch(state, value) {
    state.initialPunch = value;
  },
};
