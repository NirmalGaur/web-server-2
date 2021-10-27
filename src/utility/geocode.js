const request = require('request');
const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=pk.eyJ1IjoibmlybWFsODE0IiwiYSI6ImNrdXdlZnE5ZTBuMzQyd3FmbW1zZmZkZGUifQ.1VEKMeHm0005Js5syzYpKg&limit=1`; //instead of just putting address in the string, we use encodeURIComponent function. This helps whenever some location contains a special character that actually mean something in a url structure. For example ? becomes %3F
  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to location servies', undefined);
    } else if (response.body.features.length === 0) {
      callback('Unable to find location. Try another search', undefined);
    } else {
      callback(undefined, {
        latitude: response.body.features[0].center[1],
        longitude: response.body.features[0].center[0],
        location: response.body.features[0].place_name,
      });
    }
  });
};

module.exports = geocode;
