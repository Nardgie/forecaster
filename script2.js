var weatherDisplay = document.getElementById("weather-display");
weatherDisplay.style.display = "none";
var forecastRow = document.getElementById("forecast-row");
var title = document.getElementById("title");
var cityName = document.getElementById("city-name");
var cityInput = document.getElementById("city-input").value;

var cities = JSON.parse(localStorage.getItem("cities")) || [];
console.log(cities);

function formatCityName(cityName) {
    return cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
}

var lat;
var lon;

function fetchGeoData(cityInput) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: cityInput }, function (results, status) {
        if (status === "OK") {
            lat = results[0].geometry.location.lat();
            lon = results[0].geometry.location.lng();

            fetchWeather(cityName, lat, lon);
        } else {
            console.error(
                "Geocode was not successful for the following reason: " + status
            );
        }
    });
}

// Function to fetch current weather and 5-day forecast data from OpenWeather API
function fetchWeather(cityName, lat, lon) {
    var apiKey = "9fda455ae9137822224a160754647dd2";
    var humidity = document.getElementById("humidity");
    var currentDate = document.getElementById("current-date");

    cityInput = document.getElementById("city-input").value;
    cityName = document.getElementById("city-name");

    var title = document.getElementById("title");
    var temperature = document.getElementById("temperature");
    var wind = document.getElementById("wind");
    var currentIcon = document.getElementById("weather-icon");

    var forecastRow = document.getElementById("forecast-row");

    fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey +
        "&units=imperial"
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var temp = data.main.temp;
            console.log("Temperature: " + temp + "°F");

            cityName.textContent = data.name;
// Setting the city name in local storage here -
            localStorage.setItem("city", cityName);

            title.innerHTML += ` for ${data.name}: `;

            currentIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;

            wind.textContent = `Wind: ${data.wind.speed} MPH`;

            temperature.textContent = `Temp: ${temp}°F`;

            humidity.textContent = `Humidity: ${data.main.humidity}%`;

            currentDate.textContent = `(${new Date(data.dt * 1000).toLocaleDateString()})`;
        })
        .catch(function (error) {
            console.log(error);
        });

    fetch(
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey +
        "&units=imperial"
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            for (var i = 8; i < data.list.length; i++) {
                if (i % 8 === 0 || i === 39) {
                    console.log(data.list[i]);
                    var fDate = `${new Date(
                        data.list[i].dt * 1000
                    ).toLocaleDateString()}`;
                    console.log(fDate);
                    var fTemp = `Temp: ${data.list[i].main.temp}°F`;
                    var fWind = `Wind: ${data.list[i].wind.speed} MPH`;
                    var fHumidity = `Humidity: ${data.list[i].main.humidity}%`;
                    var icon = data.list[i].weather[0].icon;

                    forecastHTML = `
                            <div id="card-col" class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title date">${fDate}</h5>
                                        <img src="https://openweathermap.org/img/w/${icon}.png" alt="weather icon">
                                        <p class="card-text temp">${fTemp}</p>
                                        <p class="card-text humid">${fWind}</p>
                                        <p class="card-text wind">${fHumidity}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    forecastRow.innerHTML += forecastHTML;
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });

    console.log(cityName.textContent);
    console.log("fetchWeather function ran");
}

console.log(cityName.textContent);

window.onload = function () {
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    // clear local storage
    // localStorage.clear();
    storedCities.forEach(function (cityName) {
        var existingButton = document.getElementById(cityName);
        if (!existingButton) {
            createCityButton(cityName);
        }
    });
};

function createCityButton(cityName) {
    var formattedCityName = formatCityName(cityName);
    var btn = document.createElement("button");
    btn.textContent = formattedCityName;
    console.log(formattedCityName);
    btn.id = formattedCityName;
    console.log(btn.id);
    btn.type = "submit";
    btn.classList.add("button", "btn", "btn-secondary");
    btn.setAttribute("data-city", formattedCityName);

    document.getElementById("button-grp").appendChild(btn);
}

function saveCity(cityName) {
    var formattedCityName = formatCityName(cityName);
    console.log(formattedCityName);
    if (!cities.includes(cityName)) {
        cities.push(cityName);
        localStorage.setItem("cities", JSON.stringify(cities));
        createCityButton(formattedCityName);
        console.log(cities);
    }
}

document.getElementById("button-grp").addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.matches("button")) {
        var cityNameBtn = e.target.getAttribute("data-city");
        // cityInput.value = cityName;
        // console.log(cityInput);
        weatherDisplay.style.display = "block";
        fetchGeoData(cityNameBtn);
        forecastRow.innerHTML = "";
        cityName.textContent = "";
        title.innerHTML = "5-Day Forecast ";
    }
});

document.getElementById("search").addEventListener("click", function (e) {
    e.preventDefault();
    weatherDisplay.style.display = "block";

    var cityInput = document.getElementById("city-input").value.trim();
    var cityName = document.getElementById("city-name");
    if (cityInput) {
        fetchGeoData(cityInput);
        console.log(cityName.textContent);
        saveCity(cityInput);
        console.log(cityInput);
        forecastRow.innerHTML = "";
        cityName.textContent = "";
        title.innerHTML = "5-Day Forecast ";
    }
});
