export default class APIcalls {
  async searchCity(cityName) {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=0f969d81ee194864a4c161831242406&q=${cityName}&days=3&aqi=no&alerts=no, { mode: "cors" }`
      );
      if (res.status === 400)
        throw new Error(
          `We couldn't find any data on the city ${cityName}. Please try again`
        );
      if (!res.ok) {
        throw new Error(`Something went wrong. Please try again`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      alert(err);
    }
  }

  async getCity(lat, lon) {
    try {
      const res = await fetch(
        `http://api.weatherapi.com/v1/timezone.json?key=0f969d81ee194864a4c161831242406&q=${lat}, ${lon}
        `
      );
      if (!res.ok) {
        throw new Error(`Cannot access user location`);
      }
      const data = await res.json();
      return data.location.name;
    } catch (err) {
      alert(err);
    }
  }

  async getUserCoords() {
    const promise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    try {
      const position = await promise;
      return position.coords;
    } catch (err) {
      console.log(err);
    }
  }
}
