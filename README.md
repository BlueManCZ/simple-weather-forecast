# Simple weather forecast
Simple HTML/JavaScript application for fetching and displaying
weather from [Open Weather Map](https://openweathermap.org) API.

Try [live demo](http://marcus.webly3d.net/static/simple-weather-forecast/index.html).
(download size about 43 MB)

## Usage

```shell
git clone https://github.com/BlueManCZ/simple-weather-forecast.git
cd simple-weather-forecast
# firefox index.html
# vivaldi index.html
# brave index.html

# any browser should work fine
```

Start typing into the search bar and city recommendations will appear.
Choose one and the weather forecast will be fetched and displayed.

Application also supports geolocation.

## Project structure

- [index.html](index.html) - HTML structure.

- [static/js/main.js](static/js/main.js) - JavaScript classes
and functions.
- [static/data/city.list.js](static/data/city.list.js) - city
database [JSON file](https://bulk.openweathermap.org/sample/city.list.json.gz)
from [Open Weather Map](https://openweathermap.org).
- [static/styles](static/styles) - SASS and CSS files.
- [static/GifLoader.js](static/GifLoader.js) -
[My library](https://github.com/BlueManCZ/GifLoader.js) for nice loading animation.