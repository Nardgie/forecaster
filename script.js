var city;
var lat;
var lon;
var buttonGrp = document.getElementById("button-grp");
var apiKey = "9fda455ae9137822224a160754647dd2";
// var geocoder = new google.maps.Geocoder();

var searchButton = document.getElementById("search");

// var cityName = document.getElementById("city-name");
// var temperature = document.getElementById("temperature");
var humidity = document.getElementById("humidity"); 
var currentDate = document.getElementById("current-date");
var weatherDisplay = document.getElementById("weather-display");
var existingButton;
weatherDisplay.style.display = "none";

searchButton.addEventListener("click", function(e) {
    // All of this could be in a function
    e.preventDefault();
    weatherDisplay.style.display = "block";
    var geocoder = new google.maps.Geocoder();

    var cityInput = document.getElementById("city-input").value;
    var cityName = document.getElementById("city-name");
    var cityNameString = cityName.textContent
      .replace(/\W+/g, "-")
      .toLowerCase();

    existingButton = document.getElementById(cityNameString);
    var title = document.getElementById("title");
    var temperature = document.getElementById("temperature");
    var wind = document.getElementById("wind");
    var currentIcon = document.getElementById("weather-icon");

    var forecastRow = document.getElementById("forecast-row");

    // var buttonGrp = document.getElementById("button-grp");
    // var btnHtml = `                   
    //     <button id="${localStorage.getItem("city")}" type="button" class="btn btn-secondary">${localStorage.getItem("city")}</button>
    //     `;
    // buttonGrp.append(btnHtml);

    forecastRow.innerHTML = "";
    cityName.textContent = "";
    title.innerHTML = "5-Day Forecast ";
    // var fDate = document.getElementsByClassName("date");
    // var fHumidity = document.getElementsByClassName("humid");
    // var fTemp = document.getElementsByClassName("temp");
    // var fWind = document.getElementsByClassName("f-wind");

    geocoder.geocode({address: cityInput}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lon = results[0].geometry.location.lng();
            console.log(results);
            console.log(lat);
            console.log(lon);

            fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                var temp = data.main.temp; // Assuming you want the first day's temperature
                console.log("Temperature: " + temp + "°F");

                cityName.textContent = data.name;
                localStorage.setItem("city", cityNameString.textContent); // Store the city name in local storage

                // Check if a button with the same city name already exists
                // var existingButton = document.getElementById(cityName);
                if (!existingButton) {
                  // If not, create a new button and append it to buttonGrp
                  var newButton = document.createElement("button");
                  newButton.id = cityName.textContent.replace(/\W+/g, "-").toLowerCase();
                  newButton.type = "submit";
                  newButton.className = "btn btn-secondary";
                  newButton.textContent = cityName.textContent;
                  newButton.addEventListener("click", function (e) {
                    // Handle the click event, e.g., fetch and display weather data for the city

                    e.preventDefault();
                    e.stopPropagation();
                    cityInput.value = cityName;
                    if (existingButton) {
                      // If the button already exists, remove it and create a new one
                      existingButton.remove();
                    }
                    // searchButton.click();
                

                  });
                  buttonGrp.appendChild(newButton);
                }

    // When the page loads, recreate the buttons from local storage
    
                title.innerHTML += ` for ${data.name}: `;

                currentIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;

                wind.textContent = `Wind: ${data.wind.speed} MPH`;

                temperature.textContent = `Temp: ${temp}°F`;

                humidity.textContent = `Humidity: ${data.main.humidity}%`;

                currentDate.textContent = `(${new Date(
                  data.dt * 1000
                ).toLocaleDateString()})`;
            })
            .catch(function (error){
                console.log(error);
            })

            fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                for (var i = 8; i < data.list.length; i++) {
                    if (i % 8 === 0 || i === 39) {
                        console.log(data.list[i]);
                        var fDate = `${new Date(data.list[i].dt * 1000).toLocaleDateString()}`;
                        // var fDate = data.list[i].dt_txt.split(" ")[0].split("");
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
            .catch(function (error){
                console.log(error);
            
            })

        } else {
          // Handle the error
            console.log("Geocoding failed: " + status);
        }
    })
})

window.onload = function () {
    // var buttonGrp = document.getElementById("button-grp");
    var storedCity = localStorage.getItem("city");
    if (storedCity) {
        var existingButton = document.getElementById(storedCity);
        if (!existingButton) {
        var newButton = document.createElement("button");
        newButton.id = storedCity;
        newButton.type = "submit";
        newButton.className = "btn btn-secondary";
        newButton.textContent = storedCity;
        newButton.addEventListener("click", function (e) {
            // Handle the click event, e.g., fetch and display weather data for the city
            e.preventDefault();
            e.stopPropagation();
            var cityInput = document.getElementById("city-input");
            cityInput.value = storedCity;
            searchButton.click();
        })
            buttonGrp.appendChild(newButton);
        
        };
    }
}

//     }
//     }

// geocoder.geocode({address: cityInput}, function (results, status) {
//     if (status === google.maps.GeocoderStatus.OK) {
//         lat = results[0].geometry.location.lat();
//         lon = results[0].geometry.location.lng();
        

//     }
// })




    // var apiKey = "9fda455ae9137822224a160754647dd2";
    // city = "Orlando"
    // lat = 28.5383;
    // lon = -81.3792;
    // var weatherEndpoint = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    // fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey)
    // .then(function (response) {
    //     return response.json();
    // })
    // .then(function (data) {
    //     var temp = data.main.temp;
    //     console.log("Temperature: " + temp);
    //     console.log(data);

    // });