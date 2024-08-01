function getFromLocalStorage() {
  const cityList = JSON.parse(window.localStorage.getItem("cities"));

  return cityList;
}

function saveToLocalStorage(city) {
  const cityList = getFromLocalStorage() ?? [];

  if (cityList.includes(city)) return;

  cityList.push(city);
  window.localStorage.setItem("cities", JSON.stringify(cityList));
}

function moveToLastOnLocalStorage(city) {
  const cityList = getFromLocalStorage() ?? [];

  cityList.splice(cityList.indexOf(city), 1);
  cityList.push(city);
  window.localStorage.setItem("cities", JSON.stringify(cityList));
}

export { getFromLocalStorage, saveToLocalStorage, moveToLastOnLocalStorage };
