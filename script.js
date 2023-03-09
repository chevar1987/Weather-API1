const apiKey = 'a68fca5115241dd53f87e996552dcaac';
const form = document.querySelector('form');
const cityInput = document.querySelector('#city');
const currentWeatherDiv = document.querySelector('#current-weather');
const forecastDiv = document.querySelector('#forecast');
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (city) {
    searchCity(city);
  }
});

function searchCity(city) {
  // Fetch current weather data
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      // Display current weather data
      const currentDate = new Date();
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
      const currentWeatherHtml = `
        <div class="card">
          <h2>${data.name} (${currentDate.toLocaleDateString()}) <img src="${iconUrl}" alt="${data.weather[0].description}"></h2>
          <p>Temperature: ${data.main.temp} °C</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Wind Speed: ${data.wind.speed} km/h</p>
        </div>
      `;
      currentWeatherDiv.innerHTML = currentWeatherHtml;

      // Fetch forecast data
      const { lat, lon } = data.coord;
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    })
    .then(response => response.json())
    .then(data => {
      // Display forecast data
      let forecastHtml = '';
      for (let i = 0; i < data.list.length; i += 8) {
        const forecastData = data.list[i];
        const forecastDate = new Date(forecastData.dt * 1000);
        const iconUrl = `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`;
        forecastHtml += `
          <div class="card">
            <h2>${forecastDate.toLocaleDateString()} <img src="${iconUrl}" alt="${forecastData.weather[0].description}"></h2>
            <p>Temperature: ${forecastData.main.temp} °C</p>
            <p>Humidity: ${forecastData.main.humidity}%</p>
            <p>Wind Speed: ${forecastData.wind.speed} km/h</p>
          </div>
        `;
      }
      forecastDiv.innerHTML = forecastHtml;

      // Add city to search history
      if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
      }
    })
    .catch(error => console.error(error));
}

function displaySearchHistory() {
  const searchHistoryDiv = document.querySelector('#search-history');
  let searchHistoryHtml = '';
  for (let i = 0; i < searchHistory.length; i++) {
    searchHistoryHtml += `<button onclick="searchCity('${searchHistory[i]}')">${searchHistory[i]}</button>`;
  }
  searchHistoryDiv.innerHTML = searchHistoryHtml;
}

// Display search history on page load
displaySearchHistory();
