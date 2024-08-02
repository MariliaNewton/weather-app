import APIcalls from "./apiCalls";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  moveToLastOnLocalStorage,
} from "./localStorage";

const loader = document.querySelector("#preloader");

const citySearch = document.querySelector(".city-search");
const searchBtn = document.querySelector(".search");
const nextHoursContainer = document.querySelector(".next-hours-container");
const rightBtnHoursContainer = document.querySelector(".next");
const leftBtnHoursContainer = document.querySelector(".previous");
const body = document.querySelector("body");

const dayCards = document.querySelectorAll(".day-card");
const hourCards = document.querySelectorAll(".hour-card");
const historyBtn = document.querySelector(".history-button");
const historyCitiesContainer = document.querySelector(
  ".history-cities-container"
);

const city = document.querySelector(".city-name");
const country = document.querySelector(".country-name");
const weekDayEl = document.querySelector(".week-day");
const monthDayEl = document.querySelector(".month-day");
const precipitationCelsius = document.querySelector(".precipitation-c");
const precipitationFahrenheit = document.querySelector(".precipitation-f");
const humidity = document.querySelector(".humidity");
const windCelsius = document.querySelector(".wind-c");
const windFahrenheit = document.querySelector(".wind-f");
const weatherLogo = document.querySelector(".weather-logo");
const degreesCelsius = document.querySelector(".main-degrees-c");
const degreesFahrenheit = document.querySelector(".main-degrees-f");
const switchBtn = document.querySelector(".switch");
const celsius = document.querySelectorAll(".celsius");
const fahrenheit = document.querySelectorAll(".fahrenheit");
const tempCelsius = document.querySelectorAll(".temp-c");
const tempFahrenheit = document.querySelectorAll(".temp-f");
const maxCelsius = document.querySelectorAll(".max-c");
const maxFahrenheit = document.querySelectorAll(".max-f");
const minCelsius = document.querySelectorAll(".min-c");
const minFahrenheit = document.querySelectorAll(".min-f");

const apiCalls = new APIcalls();

export default class DisplayDOM {
  activeCity = "";
  activeForecast = [];
  activeData = {};
  backgroundGif = {
    sunny: [1000],
    cloudy: [1009, 1006, 1003],
    rainy: [
      1063, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246,
      1273, 1276,
    ],
    snowy: [
      1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282,
      1117,
    ],
    drizzle: [1150, 1153, 1168, 1171, 1072],
    fog: [1135, 1147, 1030],
    sleet: [1069, 1204, 1207, 1249, 1252, 1261, 1264, 1237],
    thunder: [1087],
  };

  init() {
    // Backup city if user location denied
    this.updateCity("Maceio", false);

    this.renderUserCity();

    searchBtn.addEventListener("click", () => this.onCitySearch());

    citySearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.onCitySearch();
      }
    });

    dayCards.forEach((card) =>
      card.addEventListener("click", () => {
        const day = +card.dataset.day;

        // Update data
        this.renderNextHours(day);
        this.renderDate(day);
        this.renderCurrentTemp(day);
        this.renderWeatherData(day);

        // Selects correct day card
        this.selectDayCard(day);
      })
    );

    switchBtn.addEventListener("click", () => {
      [
        celsius,
        fahrenheit,
        tempCelsius,
        tempFahrenheit,
        maxCelsius,
        maxFahrenheit,
        minCelsius,
        minFahrenheit,
      ].forEach((entry) =>
        entry.forEach((el) => el.classList.toggle("hidden"))
      );

      degreesCelsius.classList.toggle("hidden");
      degreesFahrenheit.classList.toggle("hidden");
    });

    rightBtnHoursContainer.addEventListener("click", () => {
      nextHoursContainer.scrollBy({
        left: 250,
        behavior: "smooth",
      });
    });

    leftBtnHoursContainer.addEventListener("click", () => {
      nextHoursContainer.scrollBy({
        left: -250,
        behavior: "smooth",
      });
    });

    historyBtn.addEventListener("click", () => {
      this.renderCitiesHistory();
      historyCitiesContainer.classList.toggle("visible");
    });

    historyCitiesContainer.addEventListener("click", (e) => {
      if (!e.target.classList.contains("history-city")) return;

      this.updateCity(e.target.textContent, false);
      historyCitiesContainer.classList.toggle("visible");
      moveToLastOnLocalStorage(e.target.textContent);
    });

    // Allow scroll on next hours forecast
    this.pointerScroll(nextHoursContainer);
  }

  onCitySearch() {
    if (!citySearch.value) return;
    this.updateCity(citySearch.value);
    citySearch.value = "";
    historyCitiesContainer.classList.add("visible");
  }

  async renderUserCity() {
    const coords = await apiCalls.getUserCoords();
    if (!coords) {
      loader.style.display = "none";
      return;
    }

    const { latitude, longitude } = coords;

    const cityName = await apiCalls.getCity(latitude, longitude);

    await this.updateCity(cityName, false);

    loader.style.display = "none";
  }

  async updateCity(city, save = "true") {
    this.activeData = await apiCalls.searchCity(city);
    if (!this.activeData) return;
    this.activeCity = this.activeData.location.name;

    if (save) saveToLocalStorage(this.activeCity);
    this.activeForecast = this.activeData.forecast.forecastday;

    this.renderNext3Days();
    this.renderCityCountry();
    this.backgroundGifChoice(0);
    this.renderNextHours(0);
    this.renderDate(0);
    this.renderCurrentTemp(0);
    this.renderWeatherData(0);
  }

  renderWeatherData(day) {
    precipitationCelsius.textContent = `${this.activeForecast[day].day.totalprecip_mm} mm`;
    precipitationFahrenheit.textContent = `${this.activeForecast[day].day.totalprecip_in} in`;
    humidity.textContent = `${this.activeForecast[day].day.avghumidity} %`;
    windCelsius.textContent = `${this.activeForecast[day].day.maxwind_kph} kph`;
    windFahrenheit.textContent = `${this.activeForecast[day].day.maxwind_mph} mph`;
  }

  renderCurrentTemp(day) {
    degreesCelsius.innerHTML = `${Math.trunc(
      this.activeForecast[day].day.avgtemp_c
    )}&deg`;
    degreesFahrenheit.innerHTML = `${Math.trunc(
      this.activeForecast[day].day.avgtemp_f
    )}&deg`;

    weatherLogo.src = `https:${this.activeForecast[day].day.condition.icon}`;
  }

  renderNextHours(day) {
    const forecastByHour = this.activeForecast[day].hour;
    hourCards.forEach((card, i) => {
      card.querySelector(
        ".weather-logo"
      ).src = `https:${forecastByHour[i].condition.icon}`;

      card.querySelector(".temp-c").innerHTML = `${Math.trunc(
        forecastByHour[i].temp_c
      )}&deg`;
      card.querySelector(".temp-f").innerHTML = `${Math.trunc(
        forecastByHour[i].temp_f
      )}&deg`;
    });
  }

  renderCityCountry() {
    city.textContent = this.activeData.location.name;
    country.textContent = this.activeData.location.country;
  }

  renderDate(day) {
    const date = new Date(this.activeForecast[day].date.split("-"));

    const monthDay = date.getDate();
    const weekDay = date.toLocaleString("default", { weekday: "short" });
    const month = date.toLocaleString("default", { month: "long" });

    weekDayEl.textContent = `${weekDay},`;
    monthDayEl.textContent = `${monthDay} ${month}`;
  }

  renderNext3Days() {
    dayCards.forEach((day, i) => {
      const date = new Date(this.activeForecast[i].date.split("-"));

      const weekDay = date.toLocaleString("default", { weekday: "short" });

      day.querySelector(".day").textContent = weekDay.toUpperCase();
      day.querySelector(
        ".weather-logo"
      ).src = `https:${this.activeForecast[i].day.condition.icon}`;

      day.querySelector(
        ".max-c"
      ).innerHTML = `${this.activeForecast[i].day.maxtemp_c}&deg`;
      day.querySelector(
        ".min-c"
      ).innerHTML = `${this.activeForecast[i].day.mintemp_c}&deg`;

      day.querySelector(
        ".max-f"
      ).innerHTML = `${this.activeForecast[i].day.maxtemp_f}&deg`;
      day.querySelector(
        ".min-f"
      ).innerHTML = `${this.activeForecast[i].day.mintemp_f}&deg`;
    });
  }

  selectDayCard(day) {
    dayCards.forEach((card) => card.classList.remove("selected"));
    dayCards[day].classList.add("selected");
  }

  backgroundGifChoice(day) {
    body.className = "";
    const gif = Object.keys(this.backgroundGif).find((key) =>
      this.backgroundGif[key].includes(
        this.activeForecast[day].day.condition.code
      )
    );

    body.classList.add(gif);
  }

  renderCitiesHistory() {
    historyCitiesContainer.innerHTML = "";
    getFromLocalStorage()?.forEach((city) => {
      const newCity = document.createElement("h3");
      newCity.textContent = city;
      newCity.classList.add("history-city");
      historyCitiesContainer.insertAdjacentElement("afterbegin", newCity);
    });
  }

  pointerScroll(elem) {
    const dragStart = (ev) => elem.setPointerCapture(ev.pointerId);
    const dragEnd = (ev) => elem.releasePointerCapture(ev.pointerId);
    const drag = (ev) =>
      elem.hasPointerCapture(ev.pointerId) && (elem.scrollLeft -= ev.movementX);

    elem.addEventListener("pointerdown", dragStart);
    elem.addEventListener("pointerup", dragEnd);
    elem.addEventListener("pointermove", drag);
  }
}
