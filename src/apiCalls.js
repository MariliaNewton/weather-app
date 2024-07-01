export default class APIcalls {
  async searchCity(cityName) {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=0f969d81ee194864a4c161831242406&q=${cityName}&days=3&aqi=no&alerts=no, { mode: "cors" }`
    );
    const data = await res.json();
    console.log(data);
    console.log(data.forecast);
  }
}
