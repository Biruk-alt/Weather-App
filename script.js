"use strict";
const contentContainer = document.querySelector(`.content-container`);
const hintMsg = document.querySelector(`.hint`);
const input = document.querySelector(`.input`);
const searchBtn = document.querySelector(`.search-btn`);
const form = document.querySelector(`form`);

form.addEventListener(`submit`, function (e) {
    e.preventDefault();
    input.blur();
    const city = input.value.trim().toLowerCase();
    contentContainer.innerHTML = "";

  const getData = async function (city) {
    try {

        const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`,
    );
    const data = await res.json();

    const resWeather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${data.results[0].latitude}&longitude=${data.results[0].longitude}&current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,wind_speed_10m`,
    );
    const dataWeather = await resWeather.json();
    console.log(resWeather)
    if(!res) {
        throw new Error(`can not find city`);
    }
    

    let emoji;
    let description;
    const code = dataWeather.current.weather_code;

    if (code === 0) {
      emoji = "☀️";
      description = "Clear Sky";
    } else if (code <= 3) {
      emoji = "⛅";
      description = "Cloudy";
    } else {
      emoji = "🌧️";
      description = "Rain or other";
    }

    const html = `
            <div class="city-and-region">
                <h2 class="city">${data.results[0].name}</h2>
                <h3 class="region">${data.results[0].admin1 ? data.results[0].admin1 : ""}, ${data.results[0].country}</h3>
            </div>
            <div class="temprature">
            <div class="emoji-and-description">
            <div class="emoji">${emoji}</div>
            <h3>${description}</h3>
            </div>
            <div class="temprature-number">${dataWeather.current.temperature_2m}°C</div>
            </div>
        <div class="additional-info">
            <div class="info">
                <h4>Feels like</h4>
                <div class="additional-info-temp">${dataWeather.current.apparent_temperature}°C</div>
            </div>
            <div class="info">
                <h4>Humidity</h4>
                <div class="additional-info-temp">${dataWeather.current.relative_humidity_2m}%</div>
            </div>
            <div class="info">
            <h4>Wind</h4>
            <div class="additional-info-temp">${dataWeather.current.wind_speed_10m}Km/h</div>
            </div>
            </div>
            </div>
            `;
            hintMsg.classList.add(`hide`);
            contentContainer.insertAdjacentHTML(`beforeend`, html);
        } catch(err) {
            console.log(err.message)
        }
        };
  
  getData(city);
  input.value = "";
});
