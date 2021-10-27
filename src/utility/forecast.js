const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=0e0b59b8db9248cab09f16934f7a8e14&query=${encodeURIComponent(
    latitude
  )},${encodeURIComponent(longitude)}`;
  request({ url: url, json: true }, (error, { body }) => {
    //destructuring response object since we are only using the body property
    if (error) {
      callback('Unable to connect to weather service!', undefined);
    } else if (body.error) {
      callback('Unable to find location', undefined);
    } else {
      callback(
        undefined,
        `${body.location.name}: ${body.current.weather_descriptions[0]}, it is ${body.current.temperature} degrees outside, and feels like ${body.current.feelslike} degrees`
      );
    }
  });
};

module.exports = forecast;

// forecast(44.1545, -75.7088, (error, data) => {
//   console.log('Error', error);
//   console.log('Data', data);
// });
