class CityDatabase {
   constructor(variable) {
      this.entries = variable;
   }

   search(query, maxNumber) {
      let items = [];
      for (let i = 0; i < this.entries.length && items.length < maxNumber; i++) {
         if (this.entries[i].name.toLowerCase().startsWith(query.toLowerCase())) {
            items.push(this.entries[i]);
         }
      }
      return items;
   }
}


class Whisperer {
   constructor(id) {
      this.dom = document.getElementById(id);
      this.index = null;

      let self = this;
      this.dom.addEventListener("mouseleave", function () {
         self.removeSelection();
      });
   }

   show() {
      if (this.entries && this.entries.length > 0) {
         this.updateEntries(this.entries);
         this.dom.style.display = "table";
      }
   }

   hide() {
      if (this.index != null && this.entries.length > 0) {
         fetchForecast(this.entries[this.index].coord.lat, this.entries[this.index].coord.lon);
         document.getElementById("input-city").value = this.entries[this.index].name;
         weather.updateLocation(`${this.entries[this.index].name}, ${this.entries[this.index].country}`);
      }

      this.dom.style.display = "none";
   }

   clear() {
      this.dom.innerHTML = "";
   }

   updateEntries(list) {
      this.clear();
      this.entries = list;

      if (this.index > list.length) {
         this.index = list.length - 1;
      }

      for (let i = 0; i < list.length; i ++) {
         let city = list[i];

         let row = document.createElement("tr");

         if (i === this.index) {
            row.classList.add("active");
         }

         let self = this;
         row.addEventListener("mouseenter", function () {
            self.presetSelection(i);
         });

         let tdName = document.createElement("td");
         let tdCountry = document.createElement("td");

         tdName.innerText = city.name;
         tdCountry.innerText = city.country;

         row.appendChild(tdName);
         row.appendChild(tdCountry);

         this.dom.append(row);
      }
   }

   presetSelection(index) {
      this.index = index;
   }

   removeSelection() {
      this.index = null;
   }
}


class CurrentWeatherDisplay {
   constructor(id) {
      this.dom = document.getElementById(id);
   }

   show() {
      this.dom.style.display = "block";
   }

   updateLocation(location) {
      document.getElementById("location").innerText = location;
   }

   updateData(date, icon, temperature, status, sunrise, sunset) {
      document.getElementById("date").innerText = (new Date(date*1000)).toLocaleDateString();
      document.getElementById("current-icon").setAttribute("src", `https://openweathermap.org/img/wn/${icon}@4x.png`)
      document.getElementById("current-temp-value").innerText = temperature;
      document.getElementById("current-status").innerText = status;
      document.getElementById("sunrise").innerText = sunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      document.getElementById("sunset").innerText = sunset.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
   }
}


class ForecastDisplay {
   constructor(id) {
      this.dom = document.getElementById(id);
   }

   clear() {
      this.dom.innerHTML = "";
   }

   updateEntries(list) {
      this.clear();

      for (let i = 1; i < 6; i ++) {
         let weather = list[i];

         let table = document.createElement("table");

         let row = document.createElement("tr");

         let tdDate = document.createElement("td");
         let tdStatus = document.createElement("td");
         let tdIcon = document.createElement("td");
         let tdTemp = document.createElement("td");

         let date = new Date(weather.dt*1000);
         tdDate.innerText = date.toLocaleDateString([], {day: 'numeric', month:'numeric'});
         tdStatus.innerText = weather.weather[0].main;

         let image = document.createElement("img");
         image.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`);
         tdIcon.appendChild(image);

         tdTemp.innerText = weather.temp.day.toFixed(1) + " °C";

         row.appendChild(tdDate);
         row.appendChild(tdStatus);
         row.appendChild(tdIcon);
         row.appendChild(tdTemp);

         table.appendChild(row);

         this.dom.append(table);
      }
   }
}


// Load cities stored in database without lag
let script = document.createElement("script");
script.src = "static/data/city.list.js";
document.head.appendChild(script);

let database = null;
let whisperer = null;
let weather = null;
let forecast = null;

window.addEventListener("load", function () {
   database = new CityDatabase(CITIES_JSON);
   whisperer = new Whisperer("whisperer");
   weather = new CurrentWeatherDisplay("current-weather")
   forecast = new ForecastDisplay("weather-forecast");

   document.getElementById("input-city").addEventListener("keydown", function (event) {
      switch (event.code) {
         case "Escape": {
            whisperer.removeSelection();
            whisperer.hide();
            break;
         }

         case "ArrowDown": {
            if (whisperer.index == null && whisperer.entries.length > 0) {
               whisperer.index = 0;
               whisperer.updateEntries(whisperer.entries);
               break;
            }
            whisperer.index = (whisperer.index + 1) % whisperer.entries.length;
            whisperer.updateEntries(whisperer.entries);
            break;
         }

         case "ArrowUp": {
            if (whisperer.index == null && whisperer.entries.length > 0) {
               whisperer.index = whisperer.entries.length - 1;
               whisperer.updateEntries(whisperer.entries);
               break;
            }
            whisperer.index--;
            if (whisperer.index < 0) {
               whisperer.index = whisperer.entries.length - 1;
            }
            whisperer.updateEntries(whisperer.entries);
            break;
         }

         case "Enter": {
            if (whisperer.index == null && whisperer.entries.length > 0) {
               whisperer.index = 0;
            }
            whisperer.hide();
         }
      }
   })
});


function search(city) {
   // Meta function for city searching
   if (city.length < 1) {
      whisperer.index = null;
      whisperer.clear();
      return;
   }

   let result = database.search(city, 10);

   whisperer.updateEntries(result);
   whisperer.show();
}


function fetchForecast(lat, lon) {
   // Downloads weather forecast data from OpenWeatherMap
   let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=36ff3beab9e09f13a790b6a64e591590`;
   let request = new XMLHttpRequest();
   request.open("GET", url);
   request.setRequestHeader("Accept", "application/json");
   request.onreadystatechange = function () {
      if (request.readyState === 4) {
         let data = JSON.parse(request.responseText);

         let date = data.current.dt;
         let icon = data.current.weather[0].icon;
         let temperature = data.current.temp.toFixed(1);
         let status = data.current.weather[0].main;
         let sunrise = new Date(data.current.sunrise*1000);
         let sunset = new Date(data.current.sunset*1000);

         weather.updateData(date, icon, temperature, status, sunrise, sunset);
         weather.show();
         forecast.updateEntries(data.daily);
      }};
   request.send();
}