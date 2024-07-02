import APIcalls from "./apiCalls";

const citySearch = document.querySelector(".city-search");
const searchBtn = document.querySelector(".search");
const nextHoursContainer = document.querySelector(".next-hours-container");

const dayCards = document.querySelectorAll(".day-card");
const nextDaysContainer = document.querySelector(".next-days-container");
const hourCards = document.querySelectorAll(".hour-card");

const city = document.querySelector(".city-name");
const country = document.querySelector(".country-name");
const weekDayEl = document.querySelector(".week-day");
const monthDayEl = document.querySelector(".month-day");
const precipitation = document.querySelector(".precipitation");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const degrees = document.querySelector(".main-degrees");

const apiCalls = new APIcalls();

export default class DisplayDOM {
  activeCity = "";
  activeForecast = [];
  activeData = {};

  init() {
    searchBtn.addEventListener("click", () => this.searchNewCity());

    citySearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.searchNewCity();
      }
    });

    dayCards.forEach((card) =>
      card.addEventListener("click", () => {
        const day = +card.dataset.day;
        this.renderNextHours(day);
        this.renderDate(day);
        this.renderCurrentTemp(day);
        this.renderWeatherData(day);
      })
    );

    // Allow scroll on next hours forecast
    this.pointerScroll(nextHoursContainer);
  }

  async searchNewCity() {
    if (!citySearch.value) return;
    this.activeCity = citySearch.value;
    citySearch.value = "";
    this.activeData = await apiCalls.searchCity(this.activeCity);
    this.activeForecast = this.activeData.forecast.forecastday;

    this.renderNext3Days();
    this.renderCityCountry();
    this.renderNextHours(0);
    this.renderDate(0);
    this.renderCurrentTemp(0);
    this.renderWeatherData(0);
  }

  renderWeatherData(day) {
    precipitation.textContent = `${this.activeForecast[day].day.totalprecip_mm}mm`;
    humidity.textContent = `${this.activeForecast[day].day.avghumidity}%`;
    wind.textContent = `${this.activeForecast[day].day.maxwind_kph} kph`;
  }

  renderCurrentTemp(day) {
    degrees.innerHTML = `${Math.trunc(
      this.activeForecast[day].day.avgtemp_c
    )}&deg`;
    degrees.previousElementSibling.src = `https:${this.activeForecast[day].day.condition.icon}`;
  }

  renderNextHours(day) {
    const forecastByHour = this.activeForecast[day].hour;
    hourCards.forEach((card, i) => {
      card.querySelector(
        ".weather-logo"
      ).src = `https:${forecastByHour[i].condition.icon}`;
      card.querySelector(".temp").innerHTML = `${Math.trunc(
        forecastByHour[i].temp_c
      )}&deg`;
    });
  }

  renderCityCountry() {
    city.textContent = this.activeData.location.name;
    country.textContent = this.activeData.location.country;
  }

  renderDate(day) {
    const date = new Date(this.activeForecast[day].date.split("-"));

    const monthDay = date.getUTCDate();
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
        ".max"
      ).innerHTML = `${this.activeForecast[i].day.maxtemp_c}&deg`;
      day.querySelector(
        ".min"
      ).innerHTML = `${this.activeForecast[i].day.mintemp_c}&deg`;
    });
  }

  pointerScroll = (elem) => {
    const dragStart = (ev) => elem.setPointerCapture(ev.pointerId);
    const dragEnd = (ev) => elem.releasePointerCapture(ev.pointerId);
    const drag = (ev) =>
      elem.hasPointerCapture(ev.pointerId) && (elem.scrollLeft -= ev.movementX);

    elem.addEventListener("pointerdown", dragStart);
    elem.addEventListener("pointerup", dragEnd);
    elem.addEventListener("pointermove", drag);
  };
}
