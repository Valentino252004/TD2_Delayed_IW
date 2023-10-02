let urlAPI = 'https://geo.api.gouv.fr/communes?codePostal='
let zipcode;
let zipcodeInput = document.querySelector("#ZIPCode");
const regex = new RegExp('^\\d{5}$', 'gm');

let dropDownMunicipality = document.getElementById("commune-select");

//Listener on the input for the zip-code
zipcodeInput.addEventListener("input", (e) => {
    if (regex.test(e.target.value) && parseInt(e.target.value) < 96000) {
        dropDownMunicipality.hidden = false;
        document.getElementById("commune-label").hidden = false;
        document.getElementById("sendForm").hidden = false;
        zipcode = e.target.value;
        apiMunicipality();
    } else {
        dropDownMunicipality.hidden = true;
        document.getElementById("commune-label").hidden = true;
        document.getElementById("sendForm").hidden = true;
    }
})

// Add all the municipality with the same zip-code
function addSelectElement(element) {
    dropDownMunicipality.innerHTML = ''
    for (i = 0; i < element.length; i++) {
        const op = document.createElement('option');
        op.value = element[i].code;
        op.textContent = element[i].nom;
        dropDownMunicipality.appendChild(op);
    }
}


function testPostalCode(element) {
    return (element.length != 0);
}

// Handle geo-api 
function apiMunicipality() {
    fetch(urlAPI + zipcode)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response is not ok');
            }

            return response.json();
        })
        .then(data => {
            if (testPostalCode(data)) {
                addSelectElement(data);
            } else {
                dropDownMunicipality.hidden = true;
                document.getElementById("commune-label").hidden = true;
                document.getElementById("sendForm").hidden = true;
            }
        })
        .catch(error => {
            ('There was a problem while accessong the data', error);
        });
}


// Implementation of fixed code weather request

const CHECKBOX_LATITUDE = document.getElementById('latitude');
const CHECKBOX_LONGITUDE = document.getElementById('longitude');
const CHECKBOX_RAIN = document.getElementById('AccRain');
const CHECKBOX_WINDSPEED = document.getElementById('AvgWind');
const CHECKBOX_WINDDIR = document.getElementById('windDir');
const DIV_WEATHER = document.getElementById("weatherResponse");
let apiWeather = null;

[].forEach.call(document.getElementsByClassName("CheckButton"), function(el) {
    el.addEventListener("change", function() {
        if (apiWeather != null) {
            displayWeather(apiWeather);
        }
    });
});

const token = "e9573bea167f06b5ca0805e4ef64e697562f702d022c084058058f958b11d272"

function displayWeather(apiWeather) {
    let hasLatitude = CHECKBOX_LATITUDE.checked;
    let hasLongitude = CHECKBOX_LONGITUDE.checked;
    let hasRain = CHECKBOX_RAIN.checked;
    let hasWindSpeed = CHECKBOX_WINDSPEED.checked;
    let hasWindDir = CHECKBOX_WINDDIR.checked;

    let winddir = apiWeather["forecast"]["dirwind10m"];
    let dirtext = "";
    if (337 < winddir || winddir < 23) {
        dirtext = "Nord";
    } else if (winddir < 68) {
        dirtext = "Nord-Est";
    } else if (winddir < 113) {
        dirtext = "Est";
    } else if (winddir < 158) {
        dirtext = "Sud-Est";
    } else if (winddir < 203) {
        dirtext = "Sud";
    } else if (winddir < 248) {
        dirtext = "Sud-Ouest";
    } else if (winddir < 293) {
        dirtext = "Ouest";
    } else {
        dirtext = "Nord-Ouest";
    }

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


    DIV_WEATHER.innerHTML = `<p>Weather for ${apiWeather["city"]["name"]}: </p>`;
    
    DIV_WEATHER.innerHTML += `<p>It's ${weatherText}</p>`
    DIV_WEATHER.innerHTML += `<p>Min temperature: ${apiWeather["forecast"]["tmin"]}°C </p>`
    DIV_WEATHER.innerHTML += `<p>Max temperature: ${apiWeather["forecast"]["tmax"]}°C  </p>`
    DIV_WEATHER.innerHTML += `<p>Rain probability: ${apiWeather["forecast"]["probarain"]} %  </p>`
    DIV_WEATHER.innerHTML += `<p>Hours of sunlight: ${apiWeather["forecast"]["sun_hours"]}h  </p>`
    if (hasLatitude) {
        DIV_WEATHER.innerHTML += `<p>Latitude: ${apiWeather["city"]["latitude"]}° </p>`
    }
    if (hasLongitude) {
        DIV_WEATHER.innerHTML += `<p>Longitude: ${apiWeather["city"]["longitude"]} </p>`
    }
    if (hasRain) {
        DIV_WEATHER.innerHTML += `<p>Accumulation of rain: ${apiWeather["forecast"]["rr10"]}mm  </p>`
    }
    if (hasWindSpeed) {
        DIV_WEATHER.innerHTML += `<p>Average wind speed: ${apiWeather["forecast"]["wind10m"]}km/h  </p>`
    }
    if (hasWindDir) {
        DIV_WEATHER.innerHTML += `<p>Wind direction: ${winddir}° (${dirtext})  </p>`
    }
}

document.getElementById("sendForm").addEventListener("click", (e) => {
    let codeInsee = dropDownMunicipality.options[dropDownMunicipality.selectedIndex].value.toString();
    let req = `https://api.meteo-concept.com/api/forecast/daily/0?token=${token}&insee=${codeInsee}`;

    fetch(req)
        .then(response => {
            if (!response.ok) {
                throw new Error('not working');
            }
            return response.json();
        })
        .then(response => {
            apiWeather = response;
            displayWeather(apiWeather);
        })
        .catch(error => {
            document.getElementById("weatherResponse").innerHTML = "Not working";
        });
});