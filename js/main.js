const api_key = "4f1998c1fb463b44bdc21950c41a06e3";

const form = document.querySelector("#form");
const input = document.querySelector(".form_input");

form.onsubmit = submitHandler;

async function submitHandler(e) {
  e.preventDefault();

  if (!input.value.trim()) {
    alert("Enter city name");
    return;
  }

  const cityName = input.value.trim();
  input.value = "";

  const cityInfo = await getGeo(cityName);

  if (cityInfo.length === 0) return;

  const weatherInfo = await getWeather(cityInfo[0]["lat"], cityInfo[0]["lon"]);

  const weatherData = {
    name: weatherInfo.name,
    temp: weatherInfo.main.temp,
    humidity: weatherInfo.main.humidity,
    speed: weatherInfo.wind.speed,
    main: weatherInfo.weather[0]["main"],
  };

  renderWeatherData(weatherData);
}

async function getGeo(name) {
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${api_key}`;
  const response = await fetch(geoUrl);
  const data = await response.json();
  return data;
}

async function getWeather(lat, lon) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${api_key}`;
  const response = await fetch(weatherUrl);
  const data = await response.json();
  return data;
}

function renderWeatherData(data) {
  document.querySelector(".weather_info").classList.remove("none");
  document.querySelector(".weather_details").classList.remove("none");

  const temp = document.querySelector(".weather_temp");
  const city = document.querySelector(".weather_city");
  const humidity = document.querySelector("#humidity");
  const speed = document.querySelector("#speed");
  const img = document.querySelector(".weather_img");

  temp.innerText = Math.floor(data.temp) + "°c";
  city.innerText = data.name;
  humidity.innerText = data.humidity + "%";
  speed.innerText = data.speed + "km/h";

  const fileNames = {
    Clouds: "clouds",
    Clear: "clear",
    Rain: "rain",
    Snow: "snow",
    Mist: "mist",
    Drizzle: "drizzle",
  };

  img.src = `./img/weather/${fileNames[data.main]}.png`;
}
