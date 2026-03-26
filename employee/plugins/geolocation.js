// plugins/geolocation.js
export default ({ app }, context, inject) => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                try {
                    const { data } = await app.$axios.get(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    inject('locationData', data);
                } catch (e) {
                    inject('locationError', e);
                }
            },
            (e) => inject('locationError', e)
        );
    } else {
        inject('locationError', "Location not available");
    }
};
