import APIcalls from "./apiCalls";

const citySearch = document.querySelector(".city-search");
const searchBtn = document.querySelector(".search");

const city = document.querySelector(".city-name");
const country = document.querySelector(".country-name");
const weekDay = document.querySelector(".week-day");
const monthDay = document.querySelector(".month-day");
const precipitation = document.querySelector(".precipitation");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const degrees = document.querySelector(".main-degrees");

const apiCalls = new APIcalls();

export default class DisplayDOM {
  activeCity = "";

  init() {
    searchBtn.addEventListener("click", this.searchNewCity);
    citySearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.searchNewCity();
      }
    });

    document
      .querySelectorAll(".next-hours-container")
      .forEach(this.pointerScroll);
  }

  searchNewCity() {
    if (!citySearch.value) return;
    this.activeCity = citySearch.value;
    citySearch.value = "";
    apiCalls.searchCity(this.activeCity);
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
