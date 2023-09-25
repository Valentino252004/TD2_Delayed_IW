
// Implementation of fixed code weather request

const token = "e9573bea167f06b5ca0805e4ef64e697562f702d022c084058058f958b11d272"
const codeInsee = '14243'
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
            `Weather for ${apiWeather["city"]["name"]}: <br>
                Min Temperature: ${apiWeather["forecast"]["tmin"]} <br>
                Max Temperature: ${apiWeather["forecast"]["tmax"]} <br>
                Rain Probality: ${apiWeather["forecast"]["probarain"]} % <br>
                Hours of sunlight: ${apiWeather["forecast"]["sun_hours"]}h`

    })
    .catch(error => {
        document.getElementById("weatherResponse").innerHTML = "Not working";
    });