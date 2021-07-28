function formatDateAMPM(time) {
  let date = new Date(time);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hour = date.getHours();
  let ampm = hour >= 12 ? "PM" : "AM  ";
  hour = hour % 12;
  hour = hour ? hour : 12;
  let minutes = date.getMinutes();
  if (minutes <= 9) {
    minutes = "0" + minutes;
  }
  return `${day} ${hour}:${minutes} ${ampm}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");

  let forecast = response.data.daily;

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6)
      forecastHTML =
        forecastHTML +
        `  
        <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
         src="http:/openweathermap.org/img/wn/${
           forecastDay.weather[0].icon
         }@2x.png"
         alt=""
         width="42"
        />
       <div class="weather-forecast-temperature">
        <span class="weather-forecast-temperature-max"> ${Math.round(
          forecastDay.temp.max
        )}° </span>
        <span class="weather-forecast-temperature-min"> ${Math.round(
          forecastDay.temp.min
        )}° </span>
       </div>
       </div>
       `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let units = "imperial";
  let apiKey = "98980a45697353d2d771a3c81708573c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function search(city) {
  let units = "imperial";
  let apiKey = "98980a45697353d2d771a3c81708573c";
  let weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}`;
  axios.get(`${weatherURL}&appid=${apiKey}`).then(showTemperature);
}

function isCity(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city").value;
  search(city);
}

function showTemperature(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  console.log(response.data.wind);
  document.querySelector("#date").innerHTML = formatDateAMPM(
    response.data.dt * 1000
  );
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.weather[0].description);
  fahrenheitTemperature = response.data.main.temp;

  getForecast(response.data.coord);
}

let searchCity = document.querySelector("#city-form");
searchCity.addEventListener("submit", isCity);

search("Ponce");
