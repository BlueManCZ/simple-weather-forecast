// Load cities stored in database without lag
let script = document.createElement('script');
script.src = "static/data/city.list.js";
document.head.appendChild(script);

// Get browser locale
let locale = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;


function searchCity(cityName, maxNumber) {
    // Returns list of cities based on cityName variable
    console.log(`Searching: ${cityName}`);
    let cities = [];
    for (let i = 0; i < CITIES_JSON.length && cities.length < maxNumber; i++) {
        if (CITIES_JSON[i].name.startsWith(cityName)) {
            cities.push(CITIES_JSON[i]);
        }
    }
    return cities;
}

function search(city) {
    // Updates whisperer
    let whisperer = document.getElementById("whisperer");
    if (city.length < 3) {
        whisperer.innerHTML = "";
        return;
    }

    let result = searchCity(city, 10);

    whisperer.innerHTML = "";

    for (let i = 0; i < result.length; i ++) {
        let city = result[i];

        let row = document.createElement('tr');

        row.addEventListener("click", function () {
            console.log(`${city.coord.lat}, ${city.coord.lon}`);
            fetchForecast(city.coord.lat, city.coord.lon);
        })

        let tdName = document.createElement('td');
        let tdCountry = document.createElement('td');

        tdName.innerText = city.name;
        tdCountry.innerText = city.country;

        row.appendChild(tdName);
        row.appendChild(tdCountry);

        whisperer.append(row);
    }
}

function fetchForecast(lat, lon) {
    // Downloads weather forecast data from OpenWeatherMap
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=36ff3beab9e09f13a790b6a64e591590`;
    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.setRequestHeader("Accept", "application/json");
    request.onreadystatechange = function () {
       if (request.readyState === 4) {
          console.log(request.status);
          console.log(request.responseText);
       }};
    request.send();
}