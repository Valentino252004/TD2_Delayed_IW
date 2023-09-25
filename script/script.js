
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
            `Weather for ${apiWeather["city"]["name"]} (${apiWeather["city"]["latitude"]}°, ${apiWeather["city"]["longitude"]}°): <br>
                Min temperature: ${apiWeather["forecast"]["tmin"]} <br>
                Max temperature: ${apiWeather["forecast"]["tmax"]} <br>
                Rain probality: ${apiWeather["forecast"]["probarain"]} % <br>
                Accumation of rain: ${apiWeather["forecast"]["rr10"]}mm <br>
                Hours of sunlight: ${apiWeather["forecast"]["sun_hours"]}h <br>
                Average wind speed: ${apiWeather["forecast"]["wind10m"]}km/h <br>
                Wind direction: ${apiWeather["forecast"]["dirwind10m"]}° `
    })
    .catch(error => {
        document.getElementById("weatherResponse").innerHTML = "Not working";
    });