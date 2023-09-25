
// Implementation of fixed code weather request

const token = "e9573bea167f06b5ca0805e4ef64e697562f702d022c084058058f958b11d272"
const codeInsee = '22278'
const req = `https://api.meteo-concept.com/api/forecast/daily/0?token=${token}&insee=${codeInsee}`;

fetch(req)
    .then(response => {
        if (!response.ok) {
            throw new Error('not working');
        }
        return response.json();
    })
    .then(apiWeather => {
        document.getElementById("weatherResponse").innerHTML = 
            `Weather for ${apiWeather["city"]["name"]} (${apiWeather["city"]["latitude"]}°, ${apiWeather["city"]["longitude"]}°): <br>
                Min temperature: ${apiWeather["forecast"]["tmin"]}°C <br>
                Max temperature: ${apiWeather["forecast"]["tmax"]}°C <br>
                Rain probality: ${apiWeather["forecast"]["probarain"]} % <br>
                Accumation of rain: ${apiWeather["forecast"]["rr10"]}mm <br>
                Hours of sunlight: ${apiWeather["forecast"]["sun_hours"]}h <br>
                Average wind speed: ${apiWeather["forecast"]["wind10m"]}km/h <br>
                Wind direction: ${apiWeather["forecast"]["dirwind10m"]}° <br><br>`

        let weather = apiWeather["forecast"]["weather"];
        let weatherText = "";

        if (weather == 0) {
            weatherText = "Sunny";
        } else if (weather == 1) {
            weatherText = "A bit cloudy";
        } else if (weather < 10) {
            weatherText = "Cloudy";
        } else if (weather >= 100 && weather < 200) {
            weatherText = "Stormy";
        } else {
            weatherText = "Rainy";
        }
        document.getElementById("weatherResponse").innerHTML += weatherText;
    })
    .catch(error => {
        document.getElementById("weatherResponse").innerHTML = "Not working";
    });